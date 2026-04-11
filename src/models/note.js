import mongoose from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tag: {
      type: String,
      enum: TAGS,
    },
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", content: "text" });
export const Note = mongoose.model('Note', noteSchema);
export default Note;