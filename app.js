import express from 'express';
import { urlencoded } from 'body-parser';
import path from 'path';
const app = express();
require('dotenv').config();

app.use(urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

import bookRoutes from './server/routes/books';

app.use('/', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
