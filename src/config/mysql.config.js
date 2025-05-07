const mysql = require('mysql2');
const config = require('../consts/app');

const pool = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

pool
  .getConnection()
  .then((connection) => {
    console.log('Mysql Connected');
    connection.release();
  })
  .catch((error) => {
    console.error(error.message);
  });

module.exports = pool;
