import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { Session } from "../models/session.js";
import User from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { sendEmail } from "../utils/sendMail.js";


//  REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// REFRESH
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
      throw createHttpError(401, "Session token expired");
    }

    await Session.deleteOne({ _id: sessionId });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({
      message: "Session refreshed",
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("sessionId", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // ❗ якщо нема користувача — все одно 200
    if (!user) {
      return res.status(200).json({
        message: "Password reset email sent successfully",
      });
    }

    // 🔥 JWT (15 хв)
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

    // 📄 шаблон
    const templatePath = path.resolve(
      "src/templates/reset-password-email.html"
    );

    const source = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(source);

    const html = template({
      name: user.username, // у тебе username!
      link: resetLink,
    });

    // 📧 відправка
    await sendEmail({
      to: user.email,
      subject: "Reset password",
      html,
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    next(
      createHttpError(
        500,
        "Failed to send the email, please try again later."
      )
    );
  }
};

  export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    // 🔥 перевірка токена
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    const { sub, email } = payload;

    // 🔍 шукаємо юзера
    const user = await User.findOne({ _id: sub, email });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // 🔐 хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};
