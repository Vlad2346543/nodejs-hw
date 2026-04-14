import createHttpError from "http-errors";
import User from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "No file"));
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    const userId = req.user._id;

    // ✅ отримуємо оновлений документ
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { returnDocument: "after" } // 🔥 ОБОВʼЯЗКОВО
    );

    return res.status(200).json({
      url: updatedUser.avatar, // ✅ беремо з БД
    });
  } catch (err) {
    next(err);
  }
};