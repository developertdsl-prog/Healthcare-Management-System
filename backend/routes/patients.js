const express = require('express');
const router = express.Router();
const db = require('../db');
const User = require('../backend/User'); // Actually this won't work, let me use direct queries

// Inline bcrypt for patient routes
const bcrypt = require('bcrypt');

// Generate unique patient ID
const generatePatientID = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `P-${year}${month}${day}-${random}`;
};

// Get all patients with search and filters
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const bloodGroup = req.query.bloodGroup || '';
    const status = req.query.status || '';
    
    let query = 'SELECT id, username as name, bloodGroup, phone, lastVisit, status FROM patients';
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push(`(id LIKE ? OR name LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
    if (bloodGroup) {
      conditions.push('bloodGroup = ?');
      params.push(bloodGroup);
    }
    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Add new patient
router.post('/', async (req, res) => {
  try {
    const { name, bloodGroup, allergies, phone, address } = req.body;
    
    if (!name || !bloodGroup) {
      return res.status(400).json({ message: 'Name and blood group are required' });
    }
    
    const patientID = generatePatientID();
    
    const [result] = await db.query(
      'INSERT INTO patients (id, name, bloodGroup, allergies, phone, address, status, created_at) VALUES (?, ?, ?, ?, ?, ?, "active", NOW())',
      [patientID, name, bloodGroup, allergies || '', phone || '', address || '']
    );
    
    const [newPatient] = await db.query(
      'SELECT id, username as name, bloodGroup, phone, lastVisit, status FROM patients WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ ...newPatient, patientID });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ message: 'Error adding patient' });
  }
});

// Get single patient
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username as name, bloodGroup, allergies, phone, address, status, created_at FROM patients WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Update patient
router.patch('/:id', async (req, res) => {
  try {
    const { name, bloodGroup, allergies, phone, address, status } = req.body;
    
    const [result] = await db.query(
      'UPDATE patients SET name = ?, bloodGroup = ?, allergies = ?, phone = ?, address = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, bloodGroup, allergies || '', phone || '', address || '', status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const [updatedPatient] = await db.query(
      'SELECT id, username as name, bloodGroup, allergies, phone, lastVisit, status FROM patients WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedPatient[0]);
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Error updating patient' });
  }
});

// Deactivate patient
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE patients SET status = "inactive", updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deactivated successfully' });
  } catch (err) {
    console.error('Error deactivating patient:', err);
    res.status(500).json({ message: 'Error deactivating patient' });
  }
});

module.exports = router;