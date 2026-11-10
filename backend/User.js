const db = require('./db');
const bcrypt = require('bcrypt');

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query('SELECT id, username, email, password, role FROM users WHERE email = ?', [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  // Find user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await db.query('SELECT id, username, email, password, role FROM users WHERE username = ?', [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  // Create new user
  create: async ({ username, email, password, role }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
      return { id: result.insertId, username, email, role };
    } catch (err) {
      throw err;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  // Update user role
  updateRole: async (id, role) => {
    try {
      await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    } catch (err) {
      throw err;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
    } catch (err) {
      throw err;
    }
  },

  // Check password validity
  checkPassword: async (inputPassword, storedPassword) => {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = User;