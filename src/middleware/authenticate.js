import createHttpError from "http-errors";

import Session from "../models/session.js";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    //  Нема токена
    if (!accessToken) {
      throw createHttpError(401, "Missing access token");
    }

    //  Шукаємо сесію
    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    //  Перевірка access token
    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw createHttpError(401, "Access token expired");
    }

    //  Шукаємо користувача
    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401);
    }

    //  Додаємо користувача в req
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;