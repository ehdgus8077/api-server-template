import "reflect-metadata";
import { Router, Request, Response } from "express";
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import Logger from "./logger";
import { ErrorCode } from "../common/error";

enum MetadataKeys {
  path = "path",
  method = "method",
  swaggerParams = "swaggerParams",
}

enum Method {
  get = "get",
  post = "post",
  patch = "patch",
  del = "delete",
  put = "put",
}

interface SwaggerParams {
  description: string;
  bodyParamsJoi: Joi.ObjectSchema;
  responseJoi: {
    [statusCode: string]: Joi.ObjectSchema;
  };
}

interface APIHandlerWrapperOption {
  bodyParamsJoi?: Joi.ObjectSchema;
  log: Boolean;
}

const getAPIHandlerWrapper = async (
  req: Request,
  res: Response,
  apiHandler: Function,
  option?: APIHandlerWrapperOption
) => {
  const log = option?.log ? Logger.createLogger(req.method) : undefined;
  if (log) log.debug(`${req.path} - ${JSON.stringify(req.body)}`);

  try {
    // Validate Body Data.
    if (option?.bodyParamsJoi) {
      const result = option.bodyParamsJoi.validate(req.body);
      if (result.error) {
        if (log)
          log.debug(
            `[${req.method}] ${req.path} - ${JSON.stringify(req.body)}: ${
              result.error.details[0].message
            }`
          );
        res.status(StatusCodes.BAD_GATEWAY).json({
          errorMessage: `${result.error.details[0].message}`,
        });
        return;
      }
    }
    await apiHandler(req, res);
  } catch (error) {
    if (
      Object.values(ErrorCode).includes(error.statusCode) &&
      error.statusCode !== ErrorCode.UNEXPECTED
    ) {
      if (log)
        log.debug(
          `[${req.method}] ${req.path} - ${JSON.stringify(req.body)}: ${error}`
        );
      res.status(error.statusCode).json({
        errorMessage: error.message,
      });
    } else {
      const errorMessage = `[${req.method}] ${req.path} - ${JSON.stringify(
        req.body
      )}: ${error} ${error.stack}`;
      if (log) log.error(errorMessage);
      res.status(ErrorCode.UNEXPECTED).json({
        errorMessage: error.message,
      });
    }
  }
};

class BaseController {
  getRouter() {
    return Router();
  }

  getSwaggers(): { [path: string]: SwaggerParams & { method: string } } {
    return {};
  }

  getRoutePrefix(): string {
    return "";
  }
}

// Class Decorator
function Controller(routePrefix: string, log: boolean = false) {
  return (target: Function) => {
    const router = Router();
    const swaggers: { [path: string]: SwaggerParams & { method: string } } = {};
    const prototype = Object.getOwnPropertyDescriptors(target.prototype);
    Object.keys(prototype).forEach((key) => {
      const routeHandler = prototype[key].value;
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Method = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      if (path) {
        const swaggerParams: SwaggerParams | undefined = Reflect.getMetadata(
          MetadataKeys.swaggerParams,
          target.prototype,
          key
        );
        if (swaggerParams) {
          swaggers[path] = {
            ...swaggerParams,
            method,
          };
        }
        router[method](`${routePrefix}${path}`, (req, res) =>
          getAPIHandlerWrapper(req, res, routeHandler, {
            log,
            bodyParamsJoi: swaggerParams?.bodyParamsJoi,
          })
        );
      }
    });

    // eslint-disable-next-line no-param-reassign
    target.prototype.getRouter = () => {
      return router;
    };
    // eslint-disable-next-line no-param-reassign
    target.prototype.getSwaggers = () => {
      return swaggers;
    };
    // eslint-disable-next-line no-param-reassign
    target.prototype.getRoutePrefix = () => {
      return routePrefix;
    };
  };
}
function routeBinder(method: Method) {
  // method decorator
  return (path: string) => {
    return (target: any, key: string) => {
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
    };
  };
}

const Get = routeBinder(Method.get);
const Post = routeBinder(Method.post);
const Put = routeBinder(Method.put);
const Patch = routeBinder(Method.patch);
const Delete = routeBinder(Method.del);
const Swagger = (params: SwaggerParams) => {
  // Method Decorator
  return (target: any, key: string) => {
    Reflect.defineMetadata(MetadataKeys.swaggerParams, params, target, key);
  };
};

export { BaseController, Controller, Get, Post, Put, Patch, Delete, Swagger };
