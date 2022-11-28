import express from "express";
import morgan from "morgan";
import cors from "cors";
import { readMenu } from "./storage.js";
import { publishOrder } from "./bot.js";
import {
  checkTelegramAuthentication,
  checkTelegramAuthenticationWebAppData,
  weekDayToString,
} from "./util.js";

const corsOptions = {
  origin: ["https://y.pischule.xyz", "http://dev.com:3000"],
};

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors(corsOptions));
app.set("trust proxy", true);

const cache = new Set();

function authorizationMiddleware(req, res, next) {
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

app.get("/menu", async (_req, res, next) => {
  try {
    let menu = await readMenu();
    if (menu === null) {
      res.status(404).end();
      return;
    }

    res.json({
      items: menu.items,
      title: `Меню на ${weekDayToString(menu.deliveryDate.getDay())}`,
    });
  } catch (err) {
    console.error("/menu", err);
    next(err);
  }
});

app.use(authorizationMiddleware);

app.head("/auth", (_req, res) => {
  res.sendStatus(200);
});

app.post("/order", async (req, res, next) => {
  const idempotencyKey = req.header("Idempotency-Key");
  if (cache.has(idempotencyKey)) {
    return res.status(304).send("Not Modified");
  }
  try {
    await publishOrder(req.body, req.userId);
    if (idempotencyKey) {
      cache.add(idempotencyKey);
    }
    res.status(200).end();
  } catch (err) {
    console.error("/order", err);
    next(err);
  }
});

export { app };
