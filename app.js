import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

import bookRoutes from './routes/book';

app.use('/', bookRoutes);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})