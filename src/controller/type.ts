import Joi from "joi";

// For Mock API.
interface MockHelloBody {
  id: number;
}
const mockHelloBody = Joi.object({
  id: Joi.number().required().description("ID"),
});
const mockHelloSuccessRes = Joi.object({
  message: Joi.string().required(),
  id: Joi.number().required(),
});

export { MockHelloBody, mockHelloBody, mockHelloSuccessRes };
