const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'saiket_users',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = db;