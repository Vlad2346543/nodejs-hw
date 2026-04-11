import express from "express";
import { celebrate } from "celebrate";

import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";

const router = express.Router();

router.get("/", celebrate(getAllNotesSchema), getNotes);

router.get("/:noteId", celebrate(noteIdSchema), getNoteById);


router.post("/", celebrate(createNoteSchema), createNote);

router.patch("/:noteId", celebrate(updateNoteSchema), updateNote);

router.delete("/:noteId", celebrate(noteIdSchema), deleteNote);

export default router;