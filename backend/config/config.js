import * as dotenv from "dotenv";
dotenv.config();

const env = process.env;

export const config = {
  appUrl: env.APP_URL,
  rectsAppUrl: "https://pischule.github.io/yummy-bot-3",

  abbyyUsername: env.ABBYY_USERNAME,
  abbyyPassword: env.ABBYY_PASSWORD,

  additionalMenuItems: ["хлеб"],

  botToken: env.BOT_TOKEN,
  ordersChat: +env.ORDERS_CHAT,
  admins: env.ADMINS.split(",").map((id) => +id),
  onPhotoNotifyChat: +env.ON_PROTO_NOTIFY_CHAT,

  acceptPhotoFromHour: +env.ACCEPT_PHOTO_FROM_HOUR || 0,
  acceptPhotoToHour: +env.ACCEPT_PHOTO_TO_HOUR || 24,

  serverPort: +env.SERVER_PORT || 8080,
};
