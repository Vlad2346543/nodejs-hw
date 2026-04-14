import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errors } from "celebrate";

import notesRouter from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import cookieParser from "cookie-parser";

dotenv.config();

await connectMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(cors());

// ✅ ВАЖЛИВО
app.use(authRoutes);
app.use(notesRouter);
app.use(userRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});