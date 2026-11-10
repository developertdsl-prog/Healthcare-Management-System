const express = require('express');
const router = express.Router();
const db = require('../db');
const User = require('../User');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    // In a real app, verify JWT signature
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - no user context' });
    }
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

// --- Laboratory Routes ---

// Get all test categories
router.get('/categories', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM test_categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching test categories:', err);
    res.status(500).json({ message: 'Error fetching test categories' });
  }
});

// Add new test category
router.post('/categories', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Test category name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO test_categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );
    const [newCategory] = await db.query('SELECT * FROM test_categories WHERE id = ?', [result.insertId]);
    res.status(201).json(newCategory[0]);
  } catch (err) {
    console.error('Error adding test category:', err);
    res.status(500).json({ message: 'Error adding test category' });
  }
});

// Get all laboratory tests
router.get('/', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const search = req.query.search || '';
    const categoryId = req.query.categoryId || '';
    const [conditions] = [];
    const params = [];
    
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
      conditions.push('category_id = ?');
      params.push(categoryId);
    }
    
    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const [rows] = await db.query(
      `SELECT tl.id, tl.name, tl.description, tc.name as category_name, tl.is_active FROM test_labs tl LEFT JOIN test_categories tc ON tl.category_id = tc.id ${where} ORDER BY tl.name`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching laboratory tests:', err);
    res.status(500).json({ message: 'Error fetching laboratory tests' });
  }
});

// Add new laboratory test
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Test name is required' });
    }
    const [category] = await db.query('SELECT id FROM test_categories WHERE id = ?', [categoryId]);
    if (category.length === 0 && categoryId) {
      return res.status(400).json({ message: 'Invalid test category' });
    }
    
    const [result] = await db.query(
      'INSERT INTO test_labs (name, category_id, description, is_active) VALUES (?, ?, ?, ?)',
      [name, categoryId || null, description || '', 'active']
    );
    
    const [newTest] = await db.query(
      'SELECT tl.id, tl.name, tl.description, tl.is_active, tc.name as category_name FROM test_labs tl LEFT JOIN test_categories tc ON tl.category_id = tc.id WHERE tl.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newTest[0]);
  } catch (err) {
    console.error('Error adding laboratory test:', err);
    res.status(500).json({ message: 'Error adding laboratory test' });
  }
});

// Get patient laboratory reports
router.get('/patient/:patientId', authenticate, authorize(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // Patients can only see their own reports, doctors/admin can see any
    let query = '';
    const params = [];
    
    if (req.user.role === 'patient') {
      query = 'WHERE patient_id = ?';
      params = [patientId];
    }
    
    const [rows] = await db.query(
      `SELECT lr.id, lr.test_name, lr.result, lr.units, lr.reference_range, lr.test_date, lr.status,
        lr.prescribed_by, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p.name as patient_name
        FROM lab_reports lr
        LEFT JOIN doctors d ON lr.doctor_id = d.id
        LEFT JOIN patients p ON lr.patient_id = p.id
        ${req.user.role === 'patient' ? 'WHERE lr.patient_id = ? AND lr.patient_id = ?' : 'WHERE lr.patient_id = ?'}
        ORDER BY lr.test_date DESC
        LIMIT ? OFFSET ?`,
      ...params, [patientId, parseInt(limit), parseInt(offset)]
    );
    
    const [count] = await db.query(
      req.user.role === 'patient'
        ? 'SELECT COUNT(*) as total FROM lab_reports WHERE patient_id = ?'
        : 'SELECT COUNT(*) as total FROM lab_reports',
      req.user.role === 'patient' ? [patientId] : []
    );
    
    res.json({ reports: rows, total: count[0].total });
  } catch (err) {
    console.error('Error fetching laboratory reports:', err);
    res.status(500).json({ message: 'Error fetching laboratory reports' });
  }
});

// --- Pharmacy Routes ---

// Get all medicines
router.get('/', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const search = req.query.search || '';
    const categoryId = req.query.categoryId || '';
    const minStock = req.query.minStock || '';
    
    let query = 'SELECT m.id, m.name, m.description, m.current_stock, m.expiry_date, m.cost_price, m.selling_price, ';
    query += 'c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.id ';
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push('(m.name LIKE ? OR m.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
      conditions.push('m.category_id = ?');
      params.push(categoryId);
    }
    if (minStock) {
      conditions.push('m.current_stock <= ?');
      params.push(minStock);
    }
    
    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const [rows] = await db.query(`SELECT ${query} FROM medicines m LEFT JOIN categories c ON m.category_id = c.id ${where}} ORDER BY m.name`, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

// Add new medicine
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, categoryId, description, costPrice, sellingPrice, initialStock, expiryDate } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }
    
    const [category] = await db.query('SELECT id FROM categories WHERE id = ?', [categoryId]);
    if (category.length === 0 && categoryId) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const [result] = await db.query(
      'INSERT INTO medicines (name, category_id, description, cost_price, selling_price, current_stock, expiry_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, categoryId || null, description || '', parseFloat(costPrice) || 0, parseFloat(sellingPrice) || 0, parseInt(initialStock) || 0, expiryDate || null, 'active']
    );
    
    const [newMedicine] = await db.query(
      'SELECT m.id, m.name, m.description, m.current_stock, m.expiry_date, m.cost_price, m.selling_price, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.id WHERE m.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newMedicine[0]);
  } catch (err) {
    console.error('Error adding medicine:', err);
    res.status(500).json({ message: 'Error adding medicine' });
  }
});

// Get low-stock medicines
router.get('/low-stock', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, current_stock, expiry_date, category_id FROM medicines WHERE current_stock <= 10 AND is_active = true ORDER BY current_stock ASC'
    );
    res.json({ lowStockMedicines: rows });
  } catch (err) {
    console.error('Error fetching low-stock medicines:', err);
    res.status(500).json({ message: 'Error fetching low-stock medicines' });
  }
});

// Record medicine sale
router.post('/sales', authenticate, authorize(['admin', 'receptionist']), async (req, res) => {
  try {
    const { medicineId, quantity, patientId, appointmentId } = req.body;
    if (!medicineId || !quantity) {
      return res.status(400).json({ message: 'Medicine ID and quantity are required' });
    }
    
    // Get medicine details
    const [medicine] = await db.query('SELECT id, name, current_stock FROM medicines WHERE id = ?', [medicineId]);
    if (medicine.length === 0) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    if (medicine[0].current_stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    const newStock = medicine[0].current_stock - quantity;
    
    // Record the sale
    const [result] = await db.query(
      'INSERT INTO medicine_sales (medicine_id, quantity, patient_id, appointment_id, sale_date, remaining_stock) VALUES (?, ?, ?, ?, NOW(), ?)',
      [medicineId, quantity, patientId || null, appointmentId || null, newStock]
    );
    
    // Update medicine stock
    await db.query(
      'UPDATE medicines SET current_stock = ? WHERE id = ?',
      [newStock, medicineId]
    );
    
    const [updatedMedicine] = await db.query('SELECT id, name, current_stock FROM medicines WHERE id = ?', [medicineId]);
    
    res.json({ 
      message: 'Medicine sale recorded successfully', 
      saleId: result.insertId, 
      remainingStock: newStock,
      medicine: updatedMedicine[0] 
    });
  } catch (err) {
    console.error('Error recording medicine sale:', err);
    res.status(500).json({ message: 'Error recording medicine sale' });
  }
});

module.exports = router;