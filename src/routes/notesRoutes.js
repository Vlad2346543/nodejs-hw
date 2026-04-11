import express from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

// GET /notes
router.get('/notes', getAllNotes);

// GET /notes/:noteId
router.get('/notes/:noteId', getNoteById);

// POST /notes
router.post('/notes', createNote);

// PATCH /notes/:noteId
router.patch('/notes/:noteId', updateNote);

// DELETE /notes/:noteId
router.delete('/notes/:noteId', deleteNote);

export default router;