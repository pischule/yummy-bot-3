import _ from "lodash";
import { createHmac, createHash } from "node:crypto";
import { config } from "../config/config.js";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBasicAuthorization(username, password) {
  return "Basic " + Buffer.from(username + ":" + password).toString("base64");
}

function rectsToString(rects) {
  return rects
    .flatMap((r) => [r.l, r.t, r.r, r.b])
    .map((n) => Math.round(n * 1000))
    .join(".");
}

function authMiddleware(req, res, next) {
  if (req.query.query_id && checkTelegramAuthenticationWebAppData(req.query)) {
    const user = JSON.parse(req.query.user);
    req.userId = user.id;
    next();
  } else if (checkTelegramAuthentication(req.query)) {
    req.userId = req.query.id;
    next();
  } else {
    res.status(403).end();
  }
}

function checkTelegramAuthentication({ hash, ...userData }) {
  const secretKey = createHash("sha256").update(config.botToken).digest();

  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const hmac = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

function checkTelegramAuthenticationWebAppData({ hash, ...userData }) {
  const secretKey = createHmac("sha256", "WebAppData")
    .update(config.botToken)
    .digest();

  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const hmac = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

function stringToRects(string) {
  return _.chunk(
    string.split(".").map((i) => i / 1000),
    4
  ).map((r) => ({ l: r[0], t: r[1], r: r[2], b: r[3] }));
}

function escapeMarkdown(string) {
  const SPECIAL_CHARACTERS = "_*[]()~`>#+-=|{}.!".split("");
  SPECIAL_CHARACTERS.forEach((c) => (string = string.replaceAll(c, "\\" + c)));
  return string;
}

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function weekDayToString(day) {
  return [
    "воскресенье",
    "понедельник",
    "вторник",
    "среду",
    "четверг",
    "пятницу",
    "субботу",
  ][day];
}

export {
  wait,
  getBasicAuthorization,
  stringToRects,
  rectsToString,
  checkTelegramAuthentication,
  checkTelegramAuthenticationWebAppData,
  convertTZ,
  escapeMarkdown,
  weekDayToString,
  authMiddleware,
};
