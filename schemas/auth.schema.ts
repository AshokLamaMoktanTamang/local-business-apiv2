import Joi from "joi";

const loginSchema = {
  email: Joi.string().required(),

  password: Joi.string().required(),
};

const signupSchema = {
  username: Joi.string().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  email: Joi.string().email().required(),
};

export { loginSchema, signupSchema };
