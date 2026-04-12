import createHttpError from "http-errors";
import Note from "../models/note.js";

//  CREATE
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

//  GET ALL
export const getAllNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = parseInt(page);
    perPage = parseInt(perPage);

    let query = Note.find({
      userId: req.user._id, // 🔐 ФІЛЬТР ПО КОРИСТУВАЧУ
    });

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

//  GET BY ID
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

//  UPDATE
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id }, // 🔥 важливо
      req.body,
      { returnDocument: "after" } // ✅ ФІКС
    );

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

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id, // 🔥 важливо
    });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note); // ✅ ФІКС
  } catch (error) {
    next(error);
  }
};