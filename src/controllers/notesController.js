import Note from "../models/note.js";


export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// ✅ GET ALL (pagination + filter + search)
export const getNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = parseInt(page);
    perPage = parseInt(perPage);

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / perPage);

    const notes = await Note.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage);

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
      return res.status(404).json({ message: "Note not found" });
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
      new: true,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
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
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (error) {
    next(error);
  }
};