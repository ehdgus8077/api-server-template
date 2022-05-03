import * as winston from "winston";
import moment from "moment-timezone";

const myFormat = winston.format.printf(
  ({ level, message, label }) =>
    `${moment().tz("Asia/Seoul").format()} [${label}] ${level}: ${message}`
);

const transports = [new winston.transports.Console({ level: "debug" })];

export default class Logger {
  static createLogger(label: string): winston.Logger {
    return winston.createLogger({
      format: winston.format.combine(winston.format.label({ label }), myFormat),
      transports,
    });
  }
}
