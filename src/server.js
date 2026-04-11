import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRouter from './routes/notesRoutes.js';

dotenv.config();

// 🔥 ПІДКЛЮЧЕННЯ ДО БД
await connectMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 MIDDLEWARE
app.use(logger);
app.use(express.json());
app.use(cors());


app.use(notesRouter);


app.use(notFoundHandler);


app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/notes/:nodeId', (req, res) => {
    const {noteId} = req.params;

    res.status(200).json({
        message: `Retrieved note with ID: ${noteId}`,
    });
});
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
