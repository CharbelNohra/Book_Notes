import { Router } from 'express';
const router = Router();
import { query } from '../db.js'; // Import the database connection

import multer, { diskStorage } from 'multer';
import { extname } from 'path';


const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books ORDER BY id DESC');
        res.render('index', { books: result.rows });
    } catch (err) {
        console.error(err);
        res.send('Error retrieving books');
    }
});


router.get('/add-book', (req, res) => {
    res.render('add-book');
});


router.post('/add-book', upload.single('coverImage'), async (req, res) => {
    const { title, author, notes } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    try {
        await query(
            'INSERT INTO books (title, author, notes, cover_image) VALUES ($1, $2, $3, $4)',
            [title, author, notes, coverImage]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error adding book');
    }
});

router.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const result = await query('SELECT * FROM books WHERE id = $1', [bookId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Book not found');
        }

        const book = result.rows[0];
        res.render('book-details', { book });
    } catch (err) {
        console.error(err);
        res.send('Error retrieving the book');
    }
});

router.get('/search', async (req, res) => {
    const searchQuery = req.query.query;

    try {
        const result = await query(
            `SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)`,
            [`%${searchQuery}%`]
        );

        res.render('index', { books: result.rows });
    } catch (err) {
        console.error(err);
        res.send('Error searching for books');
    }
});

export default router;
