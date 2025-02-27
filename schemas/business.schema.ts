import Joi from "joi";

const registerBusinessSchema = {
  name: Joi.string().required(),
  address: Joi.string().required(),
  description: Joi.string().required(),
  phone: Joi.number().required(),
  email: Joi.string().email().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  image: Joi.any(),
};

export { registerBusinessSchema };
