import { Joi, Segments } from "celebrate";

// ✅ REGISTER
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), 
  }),
};

//  LOGIN
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(), 
  }),
};