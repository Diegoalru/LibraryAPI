import express from "express";
import Book from "../models/book.model.js";

const router = express.Router();

/**
 * Middleware
 */
const getBook = async (req, res, next) => {
  let book;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.book = book;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } finally {
    next();
  }
};

/**
 * ROUTES
 */
router.get("/status", (req, res) => {
  res.status(200).json({ message: "OK" });
});

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();

    // 204 No Content
    if (books.length === 0) {
      return res.status(204).json([]);
    }

    res.json({ totalBooks: books.length, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

router.post("/", async (req, res) => {
  try {
    const { title, author, genre, published_date } = req?.body;

    if (!title || !author || !genre || !published_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = new Book({ title, author, genre, published_date });
    const response = await book.save();

    res.status(201).json({ message: "Book created", response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const books = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const insertedBooks = await Book.insertMany(books);

    if (!insertedBooks) {
      return res.status(500).json({ message: "Error inserting books" });
    }

    res.status(201).json({message: "Books inserted", insertedBooks});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", getBook, async (req, res) => {
  try {
    const { title, author, genre, published_date } = req?.body;
    const book = res.book;

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    

    const updatedBook = await book.save();

    res.json({ message: "Book updated", updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", getBook, async (req, res) => {
  const { title, author, genre, published_date } = req?.body;

  if (!title && !author && !genre && !published_date) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  try {
    const book = res.book;

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.published_date = published_date || book.published_date;

    const updatedBook = await book.save();

    res.json({ message: "Book updated", updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne();

    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
