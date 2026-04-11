import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

// POST /notes
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.noteId);

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    req.body,
    { returnDocument: 'after' }
  );

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};