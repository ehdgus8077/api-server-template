import swaggerUi from "swagger-ui-express";
import * as http from "http";
import express, { Application } from "express";
import j2s from "joi-to-swagger";
import Logger from "../utils/logger";
import {
  VERSION,
  SERVER_TITLE,
  SERVER_DESCRIPTION,
  PORT,
} from "../common/constants";
import MockController from "./mock";

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

    const swaggerPath = {};
    controllers.forEach((controller) => {
      const routePrefix = controller.getRoutePrefix();
      this.app.use(controller.getRouter());
      Object.entries(controller.getSwaggers()).forEach(
        ([path, swaggerParams]) => {
          const responses = {};
          Object.entries(swaggerParams.responseJoi).forEach(
            ([statusCode, joi]) => {
              responses[statusCode] = {
                schema: j2s(joi).swagger,
              };
            }
          );
          swaggerPath[`${routePrefix}${path}`] = {
            [swaggerParams.method]: {
              tags: [routePrefix],
              consumes: ["application/json"],
              summary: swaggerParams.description,
              security: [
                {
                  ApiKeyAuth: [],
                },
              ],
              parameters: [
                {
                  name: "data",
                  in: "body",
                  schema: j2s(swaggerParams.bodyParamsJoi).swagger,
                },
              ],
              responses,
            },
          };
        }
      );
    });

    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup({
        info: {
          title: SERVER_TITLE,
          description: SERVER_DESCRIPTION,
          version: VERSION,
          swagger: "2.0",
        },
        swagger: "2.0",
        paths: swaggerPath,
        securityDefinitions: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "token",
          },
        },
      })
    );

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
