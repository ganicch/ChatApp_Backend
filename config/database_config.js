const { Pool } = require('pg')
require('dotenv').config();


const pool = new Pool({
    host: 'mouse.db.elephantsql.com',
    user: 'chedshlv',
    database: 'chedshlv',
    password: process.env.DATABASE_PASSWORD,
    port: 5432
})

module.exports = pool;