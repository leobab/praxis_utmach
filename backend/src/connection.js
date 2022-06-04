const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();

const database= {
  connectionLimit: 10,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}



const pool = mysql.createPool(database);


pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }
  if (connection) connection.release();
  console.log('La BD se conectó');
  return;
});

pool.query = promisify(pool.query);
module.exports = pool;

