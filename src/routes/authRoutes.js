import express from "express";
import { celebrate, Segments } from "celebrate";
import { refreshUserSession } from "../controllers/authController.js";
import { logoutUser } from "../controllers/authController.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh", refreshUserSession);
router.post(
  "/auth/register",
  celebrate({
    [Segments.BODY]: registerUserSchema,
  }),
  registerUser
);

router.post(
  "/auth/login",
  celebrate({
    [Segments.BODY]: loginUserSchema,
  }),
  loginUser
);

export default router;