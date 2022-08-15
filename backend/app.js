import { bot } from "./lib/bot.js";
import { app } from "./lib/server.js";
import { config } from "./config/config.js";

bot.launch().then(() => console.log("bot started"));

app.listen(config.serverPort, () => {
  console.log(`server started on port ${config.serverPort}`);
});

process.on("exit", () => {
  app.close();
  bot.stop("exit");
});
