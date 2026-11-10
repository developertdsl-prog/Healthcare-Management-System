const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthcare_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Get a client from the pool (alias for compatibility)
pool.getClient = async () => {
  const connection = await pool.getConnection();
  return connection;
};

module.exports = pool;