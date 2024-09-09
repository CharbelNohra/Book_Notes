import { Router } from 'express';
import { getBooks, addBook, getBookById, searchBooks } from '../controllers/booksController.js';

const router = Router();

// Routes

// Get all books
router.get('/', getBooks);

// Add new book
router.get('/add_book', (req, res) => {
    res.render('add_book');
});

// Post new book (no image upload, just URL input)
router.post('/add_book', addBook);

// View specific book by ID
router.get('/book/:id', getBookById);

// Search for books by title or author
router.get('/search', searchBooks);

export default router;
