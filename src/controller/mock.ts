import { Request, Response } from "express";
import * as type from "./type";
import HelloWorld from "../models/helloWorld";
import {
  Post,
  BaseController,
  Controller,
  Swagger,
} from "../utils/expressJoiSwagger";

@Controller("/mock")
class MockController extends BaseController {
  @Post("/hello")
  @Swagger({
    description: "mock API",
    bodyParamsJoi: type.mockHelloBody,
    responseJoi: {
      200: type.mockHelloSuccessRes,
    },
  })
  public hello(req: Request, res: Response) {
    const { id } = req.body.id as type.MockHelloBody;
    res.send({ message: HelloWorld.message(), id });
  }
}

export default MockController;
