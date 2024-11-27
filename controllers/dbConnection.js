const mysql = require('mysql2');
  // create the pool
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
    }
    );
  // now get a Promise wrapped instance of that pool
  
  const promisePool = pool.promise();
  // query database using promises
  module.exports = promisePool;