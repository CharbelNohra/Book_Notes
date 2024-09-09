import pool from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pool.Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;