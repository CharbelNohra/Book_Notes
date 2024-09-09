import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBooks, addBook, getBookById, searchBooks } from '../controllers/booksController.js';

// Multer Configuration for Image Uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = Router();

// Routes

// Get all books
router.get('/', getBooks);

// Add new book
router.get('/add-book', (req, res) => {
    res.render('add-book');
});
router.post('/add-book', upload.single('coverImage'), addBook);

// View specific book
router.get('/book/:id', getBookById);

// Search for books
router.get('/search', searchBooks);

export default router;
