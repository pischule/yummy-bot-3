import { bot } from "./lib/bot.js";
import server from "./lib/server.js";
import { config } from "./config.js";

bot.launch().then(() => console.log("bot started"));

server.listen(config.serverPort, () => {
  console.log(`server started on port ${config.serverPort}`);
});

process.on("exit", () => {
  server.close();
  bot.stop("exit");
});

process.on('uncaughtException', (e) => {
  console.log(e);
});
