import { Telegraf } from "telegraf";
import { config } from "../config.js";
import * as util from "./utils/util.js";
import { readObj, saveObj, readMenu } from "./storage.js";
import { createTaskAndGetDocument } from "./ocrsdk.js";
import { parseDocument } from "./parser.js";
import { escapeMarkdown } from "./utils/util.js";

const RECTS_REGEX = /.*http.*\?r=([\d.]+).*?/;
const DATE_REGEX = /.*?меню на.*?(\d{1,2}\.\d{1,2}\.\d{2,4}).*/i;

let deliveryDate = new Date(new Date().toDateString());

function adminOnlyMiddleware(ctx, next) {
  if (config.admins.includes(ctx.message?.from?.id)) {
    next();
  }
}

const bot = new Telegraf(config.botToken);

bot.use(adminOnlyMiddleware);

bot.on("photo", async (ctx) => {
  console.log("received photo");
  try {
    if (ctx.chat.id === config.ordersChat && !isOnTime()) {
      console.log("received photo too late");
      return;
    }

    await ctx.replyWithChatAction("typing");
    const rects = await readObj("rects");
    if (rects == null) {
      if (ctx.chat.id !== config.ordersChat) {
        ctx.reply("no rects");
      }
      console.error("received photo while not having rects");
      return;
    }

    const photo = ctx.message.photo.at(-1);
    const photoLink = await ctx.telegram.getFileLink(photo);
    const response = await fetch(photoLink.href);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const document = await createTaskAndGetDocument(buffer);
    const items = await parseDocument(document, rects);
    items.push(...config.additionalMenuItems);

    const createDate = new Date(new Date().toDateString());
    if (deliveryDate <= createDate) {
      deliveryDate = new Date(createDate.getTime());
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    await saveObj("menu", {
      items,
      createDate,
      deliveryDate: deliveryDate,
    });
    console.log("save new menu from photo");

    publishButton(ctx);

    if (config.onPhotoNotifyChat) {
      bot.telegram.forwardMessage(
        config.onPhotoNotifyChat,
        ctx.chat.id,
        ctx.message.message_id
      );
      bot.telegram.sendMessage(
        config.onPhotoNotifyChat,
        "/setmenu\n" + items.join("\n")
      );
    }
  } catch (err) {
    console.error("photo parsing failed", err);
  }
});

bot.command("getrects", async (ctx) => {
  try {
    const rects = await readObj("rects");
    const rectsString = util.rectsToString(rects);
    ctx.reply(`${config.rectsAppUrl}?r=${rectsString}`);
  } catch (err) {
    console.error(err);
    ctx.reply(`error: ${err}`);
  }
});

bot.hears(RECTS_REGEX, async (ctx) => {
  console.log("heard rects regex");
  try {
    const receivedRectsString = ctx.message.text.match(RECTS_REGEX)[1];
    const rects = util.stringToRects(receivedRectsString);
    await saveObj("rects", rects);
    ctx.reply(`${config.rectsAppUrl}?r=${receivedRectsString}`);
  } catch (err) {
    console.error(err);
    ctx.reply(`error: ${err.message}`);
  }
});

bot.command("getmenu", async (ctx) => {
  try {
    const menu = await readMenu();
    ctx.reply("/setmenu\n" + (menu?.items?.join("\n") ?? ""));
  } catch (err) {
    console.error(err);
    ctx.reply(`error: ${err}`);
  }
});

bot.command("setmenu", async (ctx) => {
  try {
    const lines = ctx.message.text.split("\n");
    lines.shift();
    const items = lines.map((line) => line.trim()).filter((line) => line);
    const createDate = new Date(new Date().toDateString());
    if (deliveryDate <= createDate) {
      deliveryDate = new Date(createDate.getTime());
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
    await saveObj("menu", { items, deliveryDate, createDate });

    const menu = await readMenu();
    ctx.reply("/setmenu\n" + (menu?.items?.join("\n") ?? ""));
  } catch (err) {
    console.error(err);
    ctx.reply(`error: ${err}`);
  }
});

bot.command("help", (ctx) => {
  return ctx.reply(`/getmenu - get menu
/setmenu - set menu
/getrects - get text rois
/del - delete replied message`);
});

bot.hears(DATE_REGEX, (ctx) => {
  console.log("heard date regex");
  try {
    const dateString = ctx.message.text.match(DATE_REGEX)[1];
    const [day, month, year] = dateString.split(".").map(i => +i);
    deliveryDate = new Date(year, month - 1, day);
  } catch (err) {
    console.error(err);
  }
});

bot.command("del", (ctx) => {
  const reply = ctx.message?.reply_to_message;
  if (!reply || reply.from.id !== ctx.botInfo.id) {
    return;
  }
  ctx.deleteMessage(reply.message_id);
});

bot.command("button", (ctx) => {
  publishButton(ctx);
});

function publishButton(ctx) {
  const button = {
    text: "Создать заказ",
    login_url: {
      url: config.appUrl,
    },
  };
  ctx.reply("Нажмите на кнопку ниже, чтобы создать заказ", {
    reply_markup: {
      inline_keyboard: [[button]],
    },
  });
}

function publishOrder(order, userId) {
  console.log("publish order", userId, order);
  try {
    const mention = `[${util.escapeMarkdown(
      order.name
    )}](tg://user?id=${userId})`;
    const itemsString = order.items
      .map(({ name, quantity }) => {
        const quantityPart = quantity === 1 ? "" : ` x${quantity}`;
        return `- ${name}${quantityPart}`;
      })
      .join("\n");

    const message = `${mention}:\n${escapeMarkdown(itemsString)}`;
    return bot.telegram.sendMessage(config.ordersChat, message, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function isOnTime() {
  const hourAtMinsk = util.convertTZ(new Date(), "Europe/Minsk").getHours();
  return (
    config.acceptPhotoFromHour <= hourAtMinsk &&
    hourAtMinsk < config.acceptPhotoToHour
  );
}

export { publishOrder, bot };
