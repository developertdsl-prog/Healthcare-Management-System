const db = require('./db');

const User = {
  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Find user by username
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create new user
  create: async ({ username, email, password, role }) => {
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role || 'patient']
    );
    return { id: result.insertId, username, email, role: role || 'patient' };
  },

  // Update user role
  updateRole: async (id, role) => {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  },

  // Delete user
  delete: async (id) => {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;