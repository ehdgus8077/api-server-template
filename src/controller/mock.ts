import { Request, Response } from "express";
import * as type from "./type/mock";
import HelloWorld from "../models/helloWorld";
import { Post, Controller, Swagger } from "../utils/expressJoiSwagger";

@Controller("/mock", true)
class MockController {
  @Post("/hello")
  @Swagger({
    description: "mock API",
    bodyParamsJoi: type.mockHelloBody,
    responseJoi: {
      200: type.mockHelloSuccessRes,
    },
  })
  public hello(req: Request, res: Response) {
    const { id } = req.body as type.MockHelloBody;
    res.send({ message: HelloWorld.message(), id });
  }
}

export default MockController;
