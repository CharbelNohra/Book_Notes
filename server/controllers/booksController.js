import pool from '../config/database.js';

// Function to get all books
export const getBooks = async (req, res) => {
    const sortBy = req.query.sort || 'title'; // Default sort by title

    let query = 'SELECT * FROM books';
    if (sortBy === 'rating') {
        query += ' ORDER BY rating DESC'; // Sort by rating in descending order
    } else {
        query += ' ORDER BY title ASC'; // Default sort by title in ascending order
    }

    try {
        const result = await pool.query(query);
        res.render('index', { books: result.rows });
    } catch (err) {
        console.error('Error retrieving books:', err);
        res.render('index', { books: [] }); // Render an empty list on error
    }
};

// Function to add a new book
export const addBook = async (req, res) => {
    const { title, author, notes, cover_image_url, rating } = req.body;

    try {
        await pool.query(
            'INSERT INTO books (title, author, notes, cover_image_url, rating) VALUES ($1, $2, $3, $4, $5)',
            [title, author, notes, cover_image_url, rating]
        );
        res.redirect('/');
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).send('Error adding book');
    }
};

// Function to get a specific book by ID
export const getBookById = async (req, res) => {
    const bookId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (result.rows.length > 0) {
            res.render('book_details', { book: result.rows[0] });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.error('Error retrieving book:', err);
        res.status(500).send('Error retrieving book');
    }
};

// Function to search for books by title or author
export const searchBooks = async (req, res) => {
    const searchQuery = req.query.query;

    try {
        const result = await pool.query(
            `SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)`,
            [`%${searchQuery}%`]
        );
        res.render('index', { books: result.rows });
    } catch (err) {
        console.error('Error searching for books:', err);
        res.status(500).send('Error searching for books');
    }
};
