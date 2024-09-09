import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
