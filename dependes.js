const Pool = require('pg-pool');
const fs = require('fs');
const constants = require('./services/constants');
const helpers = require('./services/helpers');

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

if (!fs.existsSync('./public/files')) {
    fs.mkdirSync('./public/files');
}

module.exports = {
    ...constants,
    ...helpers,
    pool: pool,
};