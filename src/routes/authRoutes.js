import express from "express";
import { celebrate} from "celebrate";
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

router.post("/auth/register", celebrate(registerUserSchema), registerUser);

//  login
router.post("/auth/login", celebrate(loginUserSchema), loginUser);

//  logout
router.post("/auth/logout", logoutUser);

//  refresh
router.post("/auth/refresh", refreshUserSession);

export default router;