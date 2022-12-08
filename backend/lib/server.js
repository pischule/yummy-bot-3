import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import { readMenu } from "./storage.js";
import { publishOrder } from "./bot.js";
import * as utils from "./util.js";

const corsOptions = {
  origin: ["https://y.pischule.xyz"],
};

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors(corsOptions));
app.set("trust proxy", true);

const cache = new Set();

app.get("/menu", async (_req, res) => {
  const menu = await readMenu();
  if (menu === null) {
    res.status(404).end();
    return;
  }

  const { items, deliveryDate } = menu;
  res.json({
    items,
    title: `Меню на ${utils.weekDayToString(deliveryDate.getDay())}`,
  });
});

app.use(utils.authMiddleware);

app.head("/auth", (_req, res) => {
  res.sendStatus(200);
});

app.post("/order", async (req, res, next) => {
  const idempotencyKey = req.header("Idempotency-Key");
  if (cache.has(idempotencyKey)) {
    return res.status(304).send("Not Modified");
  }
  await publishOrder(req.body, req.userId);
  if (idempotencyKey) {
    cache.add(idempotencyKey);
  }
  res.status(200).end();
});

export default app;
