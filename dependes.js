const Pool = require('pg-pool');
// const fs = require('fs');

const pool = new Pool({
    user:                    process.env.DB_USER,
    password:                process.env.DB_PASSWORD,
    host:                    process.env.DB_HOST,
    port:                    process.env.DB_PORT,
    database:                process.env.DB_DATABASE,
    ssl:                     false,
    connectionTimeoutMillis: 10000,
    max:                     15,
});

pool.on('error', (error) => {
    console.error(error);
    process.exit(-1);
});

pool.on('connect', () => {
    console.log('New client');
});

pool.on('remove', () => {
    console.log('Client pool removed');
});

// todo: create folder public if not exists

module.exports = {
    pool: pool,
};