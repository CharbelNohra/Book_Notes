import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bookNotes',
    password: 'database',
    port: 5432, // default port for PostgreSQL
});

export default pool;
