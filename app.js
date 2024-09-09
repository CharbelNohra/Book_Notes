import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import booksRoutes from './server/routes/books.js'; // Import book routes

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.set('view engine', 'ejs');

// Serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', booksRoutes); // Use book routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
