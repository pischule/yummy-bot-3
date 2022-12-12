import { createHmac, createHash } from "node:crypto";
import { config } from "../../config/config.js";

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

export function authMiddleware(req, res, next) {
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

export function validationErrorHandler(error, req, res, next) {
  if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: error.message });
}
