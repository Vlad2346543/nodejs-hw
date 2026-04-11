import createHttpError from "http-errors";
import Note from "../models/note.js";

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = parseInt(page);
    perPage = parseInt(perPage);

    let query = Note.find();

    if (tag) {
      query = query.where("tag").equals(tag);
    }

    if (search) {
      query = query.where({ $text: { $search: search } });
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query.getQuery()),
      query.skip((page - 1) * perPage).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      returnDocument: "after",
    });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};