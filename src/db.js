const mysql = require("mysql2");

// Create MySQL connection
const mysqlClient = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "foodapp",
});

module.exports = { mysqlClient };
