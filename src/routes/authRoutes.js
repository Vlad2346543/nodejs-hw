import express from "express";
import { celebrate} from "celebrate";
import { refreshUserSession } from "../controllers/authController.js";
import { logoutUser } from "../controllers/authController.js";
import { registerUserSchema, loginUserSchema,} from "../validations/authValidation.js";
import { requestResetEmail } from "../controllers/authController.js";
import { requestResetEmailSchema } from "../validations/authValidation.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import { resetPassword } from "../controllers/authController.js";
import { resetPasswordSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);

router.post( "/auth/request-reset-email", celebrate(requestResetEmailSchema),requestResetEmail);
//  login
router.post("/auth/login", celebrate(loginUserSchema), loginUser);

//  logout
router.post("/auth/logout", logoutUser);

//  refresh
router.post("/auth/refresh", refreshUserSession);

router.post("/auth/reset-password",celebrate(resetPasswordSchema),resetPassword);

export default router;