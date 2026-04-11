import { Joi, Segments } from "celebrate";
import mongoose from "mongoose";
import { TAGS } from "../constants/tags.js";


const isValidObjectId = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(""),
  }).options({ convert: true }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(isValidObjectId).required(),
  }),
};


export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(isValidObjectId).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(""),
    tag: Joi.string().valid(...TAGS),
  }).min(1), 
};