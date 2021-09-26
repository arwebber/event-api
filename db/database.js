const mariadb = require('mariadb');

const db = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

/**
 * Establish a connection to the database. Log any errors.
 */
db.getConnection((e, connection) => {
  if (e) {
    console.error(`Error connecting to ${db.host} : ${e.code}`);
  }
  if (connection) {
    connection.release();
  }
  return;
});

module.exports = db;
