import mysql from 'mysql2/promise';

let pool;



export async function getPool() {
    const { createPool } = require('mysql2/promise');

  if (!pool) {
    pool = await mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }
  return pool;
}