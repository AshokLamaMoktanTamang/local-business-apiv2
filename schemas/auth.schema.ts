import Joi from "joi";

const loginSchema = {
  email: Joi.string().required(),

  password: Joi.string().required(),
};

const signupSchema = {
  username: Joi.string().min(3).max(30).required(),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required(),

  email: Joi.string().email().required(),
};

export { loginSchema, signupSchema };
