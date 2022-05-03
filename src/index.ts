import program from "commander";
import Controller from "./controller";
import Logger from "./utils/logger";
import { validateConstants } from "./common/constants";

const log = Logger.createLogger("index");

program.command("serve").action(async () => {
  try {
    validateConstants();

    const controller = new Controller();
    await controller.start();
  } catch (err) {
    log.error(`[-] Failed to Start - ${err.message}`);
  }
});

program.parse(process.argv);
