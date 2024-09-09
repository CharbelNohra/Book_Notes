import pool from '../config/database.js';

// Get all books
export const getBooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
        res.render('index', { books: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error retrieving books");
    }
};

// Add a new book
// Add a new book
export const addBook = async (req, res) => {
    const { title, author, notes, rating } = req.body; // Include rating
    const coverImage = req.file ? req.file.filename : null;

    try {
        await pool.query(
            'INSERT INTO books (title, author, notes, cover_image, rating) VALUES ($1, $2, $3, $4, $5)',
            [title, author, notes, coverImage, rating] // Include rating
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error adding book");
    }
};

// View specific book
export const getBookById = async (req, res) => {
    const bookId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Book not found');
        }

        res.render('book-details', { book: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.send("Error retrieving the book");
    }
};

// Handle search request
export const searchBooks = async (req, res) => {
    const searchQuery = req.query.query;

    try {
        const result = await pool.query(
            `SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)`,
            [`%${searchQuery}%`]
        );
        res.render('index', { books: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error searching for books");
    }
};

