import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import { readMenu } from "./storage.js";
import { publishOrder } from "./bot.js";
import * as utils from "./utils/util.js";
import { authMiddleware, validationErrorHandler } from "./utils/middleware.js";
import Joi from "joi";

const corsOptions = {
  origin: ["https://y.pischule.xyz"],
};

const orderSchema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  items: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.object().keys({
        name: Joi.string().required().min(1),
        quantity: Joi.number().required().min(1).max(9),
      })
    ),
});

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

app.head("/auth", authMiddleware, (_req, res) => {
  res.sendStatus(200);
});

app.post("/order", authMiddleware, async (req, res) => {
  const { body, userId } = req;
  const order = await orderSchema.validateAsync(body);

  const idempotencyKey = req.header("Idempotency-Key");
  if (cache.has(idempotencyKey)) {
    return res.status(304).send("Not Modified");
  }

  await publishOrder(order, userId);
  if (idempotencyKey) {
    cache.add(idempotencyKey);
  }
  res.status(200).end();
});

app.use(validationErrorHandler);

export default app;
