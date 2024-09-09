import express from 'express';
const router =  express.Router();
import { pool } from '../db.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
        res.render('book/index', { books: result.rows });
    } catch (error) {
        res.send("Error retrieving books");
    }
});

router.get('/add_book', (req, res) => {
    res.render('book/add_book');
});

router.post('/add_book', upload.single('coverImage'), async (req, res) => {
    
});