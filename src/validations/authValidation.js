import { Joi, Segments } from "celebrate";

// ✅ REGISTER
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), 
  }),
};

export const requestResetEmailSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

//  LOGIN
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(), 
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
  }),
};
