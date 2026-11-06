const db = require('./db');

class User {
  constructor(id, username, email, password, role, created_at) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.created_at = created_at;
  }

  // Hash password
  static async hashPassword(plainPassword) {
    const bcrypt = require('bcrypt');
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    return await bcrypt.hash(plainPassword, salt);
  }

  // Compare password
  static async checkPassword(plainPassword, hashedPassword) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Find user by email
  static async findByEmail(email) {
    const pool = await db;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? new User(rows[0].id, rows[0].username, rows[0].email, rows[0].password, rows[0].role, rows[0].created_at) : null;
  }

  // Find user by ID
  static async findById(id) {
    const pool = await db;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? new User(rows[0].id, rows[0].username, rows[0].email, rows[0].password, rows[0].role, rows[0].created_at) : null;
  }

  // Find user by username
  static async findByUsername(username) {
    const pool = await db;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows.length > 0 ? new User(rows[0].id, rows[0].username, rows[0].email, rows[0].password, rows[0].role, rows[0].created_at) : null;
  }

  // Create new user
  static async create(userData) {
    const bcrypt = require('bcrypt');
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const pool = await db;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userData.username, userData.email, hashedPassword, userData.role || 'patient']
    );
    return { id: result.insertId, ...userData, password: hashedPassword };
  }

  // Update user role
  static async updateRole(id, role) {
    const pool = await db;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  }

  // Delete user
  static async delete(id) {
    const pool = await db;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;