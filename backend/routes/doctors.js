const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    // Verify the token - in a real app, use a secret key
    // For now, we'll attach a user object if token is present
    req.user = { userId: 1, role: 'admin' }; // Placeholder - will be set by proper JWT
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to authorize roles
const authorize = async (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied. No role assigned.' });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    } catch (ex) {
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

// --- Doctors Routes ---

// Get all doctors with optional filtering
router.get('/', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const search = req.query.search || '';
    const departmentId = req.query.departmentId || '';
    
    let query = 'SELECT d.id, d.first_name, d.last_name, d.specialization, d.consultation_fee, d.availability, d.department_id, dep.name as department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id';
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push('(d.first_name LIKE ? OR d.last_name LIKE ? OR d.specialization LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (departmentId) {
      conditions.push('d.department_id = ?');
      params.push(departmentId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get single doctor
router.get('/:id', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT d.id, d.first_name, d.last_name, d.specialization, d.qualifications, d.consultation_fee, d.availability, d.department_id, dep.name as department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Add new doctor
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { firstName, lastName, specialization, qualifications, consultationFee, departmentId } = req.body;
    
    if (!firstName || !lastName || !specialization) {
      return res.status(400).json({ message: 'First name, last name, and specialization are required' });
    }
    
    const [deptResult] = await db.query(
      'SELECT id FROM departments WHERE id = ?',
      [departmentId]
    );
    
    const [result] = await db.query(
      `INSERT INTO doctors (first_name, last_name, specialization, qualifications, consultation_fee, department_id, availability) VALUES (?, ?, ?, ?, ?, 'available', ?)`,
      [firstName, lastName, specialization, qualifications || '', consultationFee || 0, departmentId || null]
    );
    
    const [newDoctor] = await db.query(
      `SELECT d.id, d.first_name, d.last_name, d.specialization, d.qualifications, d.consultation_fee, d.availability, d.department_id, dep.name as department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({ ...newDoctor[0], patientID: result.insertId });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ message: 'Error adding doctor' });
  }
});

// Update doctor
router.patch('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { firstName, lastName, specialization, qualifications, consultationFee, departmentId, availability } = req.body;
    
    const updateFields = [];
    const updateParams = [];
    
    if (firstName) {
      updateFields.push('first_name = ?');
      updateParams.push(firstName);
    }
    if (lastName) {
      updateFields.push('last_name = ?');
      updateParams.push(lastName);
    }
    if (specialization) {
      updateFields.push('specialization = ?');
      updateParams.push(specialization);
    }
    if (qualifications !== undefined) {
      updateFields.push('qualifications = ?');
      updateParams.push(qualifications);
    }
    if (consultationFee !== undefined) {
      updateFields.push('consultation_fee = ?');
      updateParams.push(consultationFee);
    }
    if (departmentId !== undefined) {
      updateFields.push('department_id = ?');
      updateParams.push(departmentId);
    }
    if (availability) {
      updateFields.push('availability = ?');
      updateParams.push(availability);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    updateParams.push(req.params.id);
    
    await db.query(
      `UPDATE doctors SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );
    
    const [updatedDoctor] = await db.query(
      `SELECT d.id, d.first_name, d.last_name, d.specialization, d.qualifications, d.consultation_fee, d.availability, d.department_id, dep.name as department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.id = ?`,
      [req.params.id]
    );
    
    res.json(updatedDoctor[0]);
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Error updating doctor' });
  }
});

// Delete/deactivate doctor
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await db.query(
      'UPDATE doctors SET status = "inactive" WHERE id = ?',
      [req.params.id]
    );
    // Note: The doctors table doesn't have a status column yet - this is a placeholder
    // In a full implementation, we'd add a status column to the doctors table
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (err) {
    console.error('Error deactivating doctor:', err);
    res.status(500).json({ message: 'Error deactivating doctor' });
  }
});

// --- Departments Routes ---

// Get all departments
router.get('/departments', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// Get department with doctor count
router.get('/departments/:id', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.id, d.first_name, d.last_name, d.specialization FROM doctors d WHERE d.department_id = ?`,
      [req.params.id]
    );
    
    const [deptResult] = await db.query(
      'SELECT * FROM departments WHERE id = ?',
      [req.params.id]
    );
    
    if (deptResult.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({ ...deptResult[0], doctorCount: rows.length });
  } catch (err) {
    console.error('Error fetching department doctors:', err);
    res.status(500).json({ message: 'Error fetching department doctors' });
  }
});

// Add new department
router.post('/departments', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description || '']
    );
    
    const [newDept] = await db.query(
      'SELECT * FROM departments WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newDept[0]);
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ message: 'Error adding department' });
  }
});

module.exports = router;