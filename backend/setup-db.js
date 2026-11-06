const mysql = require('mysql2/promise');
const pool = require('./db');

async function setup() {
  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS healthcare_db');
    console.log('Database created');
    await pool.query('USE healthcare_db');
    console.log('Using healthcare_db');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor', 'receptionist', 'patient') DEFAULT 'patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('Users table created');
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['testuser', 'test@test.com', 'hashed_password', 'patient']
    );
    console.log('Test user inserted with ID:', result.insertId);
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['testuser']);
    console.log('Verified user:', rows.length > 0 ? 'YES' : 'NO');
    await pool.query('DELETE FROM users WHERE username = ?', ['testuser']);
    console.log('Test user cleaned up');
    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

setup();