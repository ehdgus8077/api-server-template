import * as http from "http";
import express, { Application } from "express";
import Logger from "../utils/logger";
import { PORT } from "../common/constants";
import MockController from "./mock";
import { registerAPI } from "../utils/expressJoiSwagger";

const log = Logger.createLogger("api/index");

export default class Controller {
  private server?: http.Server;

  private app: express.Application;

  constructor() {
    this.app = express();
  }

  public async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const controllers = [new MockController()];
    registerAPI(this.app, controllers);

    this.server = this.app.listen(PORT, async () => {
      log.info(`[+] Start Server [PORT: ${PORT}]`);
    });
  }

  public async close(): Promise<void> {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public getApp(): Application {
    return this.app;
  }
}
