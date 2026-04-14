import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";;
import User from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { sendEmail } from "../utils/sendMail.js";


export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "No file"));
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      avatar: result.secure_url,
    });

    return res.status(200).json({
      url: result.secure_url,
    });
  } catch (err) {
    next(err);
  }
};

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Якщо користувача нема — ВСЕ ОДНО 200
    if (!user) {
      return res.status(200).json({
        message: "Password reset email sent successfully",
      });
    }

    // 🔥 JWT токен (15 хв)
    const token = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔗 посилання
    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    // 📄 читаємо HTML шаблон
    const templatePath = path.resolve(
      "src/templates/reset-password-email.html"
    );

    const templateSource = await fs.readFile(templatePath, "utf-8");

    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.name || "User",
      link: resetLink,
    });

    // 📧 відправка
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return next(
      createHttpError(
        500,
        "Failed to send the email, please try again later."
      )
    );
  }
};