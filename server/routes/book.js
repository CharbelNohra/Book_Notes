import express from 'express';
const router = express.Router();
import { pool } from '../db.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
        res.render('index.ejs', { books: result.rows });
    } catch (error) {
        res.send("Error retrieving books");
    }
});

router.get('/add_book', (req, res) => {
    res.render('book/add_book.ejs');
});

router.post('/add_book', upload.single('coverImage'), async (req, res) => {
    const { title, author, description } = req.body;
    const coverImage = req.file ? req.file.filename : null;
    try {
        await pool.query('INSERT INTO books (title, author, description, coverImage) VALUES ($1, $2, $3, $4)', [title, author, description, coverImage]);
        res.redirect('index.ejs');
    } catch (error) {
        res.send("Error adding book");
    }
});

router.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }
        const book = result.rows[0];
        res.render('book_details.ejs', { book });
    } catch (error) {
        res.send("Error retrieving the book");
    }
});

router.get('/search', async (req, res) => {
    const searchQuery = req.query.search;
    try {
        const result = await pool.query(
            `SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)`,
            [`%${searchQuery}%`]
        );

        res.render('index.ejs', { books: result.rows });
    } catch (err) {
        res.send('Error searching for books');
    }
});

module.exports = router;