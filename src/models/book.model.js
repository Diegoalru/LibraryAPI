import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  published_date: {
    type: Date,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
