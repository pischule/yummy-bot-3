import { Telegraf } from "telegraf";
import { config } from "../config/config.js";
import * as util from "./util.js";
import { readObj, saveObj, readMenu } from "./storage.js";
import { createTaskAndGetDocument } from "./ocrsdk.js";
import { parseDocument } from "./parser.js";
import { escapeMarkdown } from "./util.js";

const RECTS_REGEX = /.*http.*\?r=([\d.]+).*?/;
const DATE_REGEX = /.*?меню на.*?(\d{1,2}\.\d{1,2}\.\d{2,4}).*/i;

let deliveryDate = new Date(new Date().toDateString());

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
  } catch (err) {
    console.error("photo parsing failed", err);
  }
});

bot.command("rects", async (ctx) => {
  console.log("rects called");
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

bot.command("menu", async (ctx) => {
  console.log("menu called");
  try {
    const lines = ctx.message.text.split("\n");
    if (lines.length > 1) {
      lines.shift();
      const items = lines.map((line) => line.trim()).filter((line) => line);
      const createDate = new Date(new Date().toDateString());
      if (deliveryDate <= createDate) {
        deliveryDate = new Date(createDate.getTime());
        deliveryDate.setDate(deliveryDate.getDate() + 1);
      }
      await saveObj("menu", { items, deliveryDate, createDate });
    }

    const menu = await readMenu();
    ctx.reply("/menu\n" + (menu?.items?.join("\n") ?? ''));
  } catch (err) {
    console.error(err);
    ctx.reply(`error: ${err}`);
  }
});

bot.hears(DATE_REGEX, (ctx) => {
  console.log("heard date regex");
  try {
    const dateString = ctx.message.text.match(DATE_REGEX)[1];
    const [day, month, year] = dateString.split(".");
    deliveryDate = new Date(+year, month - 1, +day);
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
    const items = order.items
      .map((item) => {
        if (item.quantity === 1) {
          return `- ${item.name}`;
        } else {
          return `- ${item.name} x${item.quantity}`;
        }
      })
      .join("\n");
    const message = `${mention}:\n${escapeMarkdown(items)}`;
    return bot.telegram.sendMessage(config.ordersChat, message, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function adminOnlyMiddleware(ctx, next) {
  if (config.admins.includes(ctx.message?.from?.id)) {
    next();
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
