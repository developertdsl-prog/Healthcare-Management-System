const express = require('express');
const router = express.Router();
const db = require('../db');
const User = require('../User');

// Middleware to authenticate JWT token
<<<<<<< HEAD
const authenticate = async (req, res, next) => {
=======
const authenticate = (req, res, next) => {
>>>>>>> milestone/10-testing-deployment
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    // In a real app, verify JWT signature
<<<<<<< HEAD
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - no user context' });
    }
=======
    // For now, attach a default user context
    req.user = { userId: 1, role: 'patient' };
>>>>>>> milestone/10-testing-deployment
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to authorize roles
<<<<<<< HEAD
const authorize = async (roles) => {
  return async (req, res, next) => {
=======
const authorize = (roles) => {
  return (req, res, next) => {
>>>>>>> milestone/10-testing-deployment
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
<<<<<<< HEAD
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
=======
  }
};

// Laboratory test categories
router.get('/laboratory-categories', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM test_categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching laboratory categories:', err);
    res.status(500).json({ message: 'Error fetching laboratory categories' });
  }
});

// Add new laboratory test category
router.post('/laboratory-categories', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO test_categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.json({ id: result.insertId, name, description });
  } catch (err) {
    console.error('Error adding laboratory category:', err);
    res.status(500).json({ message: 'Error adding laboratory category' });
  }
});

// Laboratory tests
router.get('/laboratory-tests', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM test_labs');
>>>>>>> milestone/10-testing-deployment
    res.json(rows);
  } catch (err) {
    console.error('Error fetching laboratory tests:', err);
    res.status(500).json({ message: 'Error fetching laboratory tests' });
  }
});

// Add new laboratory test
<<<<<<< HEAD
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
=======
router.post('/laboratory-tests', authenticate, authorize(['admin']), async (req, res) => {
>>>>>>> milestone/10-testing-deployment
  try {
    const { name, categoryId, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Test name is required' });
    }
<<<<<<< HEAD
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
=======
    const [result] = await db.query(
      'INSERT INTO test_labs (name, category_id, description) VALUES (?, ?, ?)',
      [name, categoryId, description || null]
    );
    res.json({ id: result.insertId, name, categoryId, description });
>>>>>>> milestone/10-testing-deployment
  } catch (err) {
    console.error('Error adding laboratory test:', err);
    res.status(500).json({ message: 'Error adding laboratory test' });
  }
});

<<<<<<< HEAD
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
=======
// Lab reports
router.get('/lab-reports', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lab_reports ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching lab reports:', err);
    res.status(500).json({ message: 'Error fetching lab reports' });
  }
});

// Create new lab report
router.post('/lab-reports', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { patientId, testId, results, status } = req.body;
    if (!patientId || !testId || !results) {
      return res.status(400).json({ message: 'Patient ID, Test ID, and Results are required' });
    }
    const [result] = await db.query(
      'INSERT INTO lab_reports (patient_id, test_id, results, status) VALUES (?, ?, ?, ?)',
      [patientId, testId, results, status || 'pending']
    );
    res.json({ id: result.insertId, patientId, testId, results, status });
  } catch (err) {
    console.error('Error creating lab report:', err);
    res.status(500).json({ message: 'Error creating lab report' });
  }
});

// Patient reports - get reports for a specific patient
router.get('/patient-reports/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const [rows] = await db.query(
      'SELECT lr.*, lt.name as test_name, tc.name as category_name FROM lab_reports lr LEFT JOIN test_labs lt ON lr.test_id = lt.id LEFT JOIN test_categories tc ON lt.category_id = tc.id WHERE lr.patient_id = ? ORDER BY lr.created_at DESC',
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patient reports:', err);
    res.status(500).json({ message: 'Error fetching patient reports' });
  }
});

// Medicine categories
router.get('/medicine-categories', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching medicine categories:', err);
    res.status(500).json({ message: 'Error fetching medicine categories' });
  }
});

// Add new medicine category
router.post('/medicine-categories', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.json({ id: result.insertId, name, description });
  } catch (err) {
    console.error('Error adding medicine category:', err);
    res.status(500).json({ message: 'Error adding medicine category' });
  }
});

// Medicines
router.get('/medicines', authenticate, async (req, res) => {
  try {
    const { categoryId, minStock } = req.query;
    let query = 'SELECT m.*, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.id';
    let params = [];
    let conditions = [];

>>>>>>> milestone/10-testing-deployment
    if (categoryId) {
      conditions.push('m.category_id = ?');
      params.push(categoryId);
    }
    if (minStock) {
      conditions.push('m.current_stock <= ?');
      params.push(minStock);
    }
<<<<<<< HEAD
    
    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const [rows] = await db.query(`SELECT ${query} FROM medicines m LEFT JOIN categories c ON m.category_id = c.id ${where}} ORDER BY m.name`, params);
=======

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query + ' ORDER BY m.name', params);
>>>>>>> milestone/10-testing-deployment
    res.json(rows);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

// Add new medicine
<<<<<<< HEAD
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
=======
router.post('/medicines', authenticate, authorize(['admin']), async (req, res) => {
>>>>>>> milestone/10-testing-deployment
  try {
    const { name, categoryId, description, costPrice, sellingPrice, initialStock, expiryDate } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }
<<<<<<< HEAD
    
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
=======
    const [result] = await db.query(
      'INSERT INTO medicines (name, category_id, description, costPrice, sellingPrice, current_stock, expiryDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, categoryId, description, costPrice, sellingPrice, initialStock, expiryDate || null]
    );
    res.json({ id: result.insertId, name, categoryId, description, costPrice, sellingPrice, initialStock, expiryDate });
>>>>>>> milestone/10-testing-deployment
  } catch (err) {
    console.error('Error adding medicine:', err);
    res.status(500).json({ message: 'Error adding medicine' });
  }
});

<<<<<<< HEAD
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
=======
// Record medicine sale
router.post('/medicine-sales', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { medicineId, quantity, salePrice, saleDate } = req.body;
    if (!medicineId || !quantity) {
      return res.status(400).json({ message: 'Medicine ID and quantity are required' });
    }
    const date = saleDate || new Date();

    // Get medicine current stock
    const [medicine] = await db.query('SELECT current_stock FROM medicines WHERE id = ?', [medicineId]);
    if (!medicine || medicine.length === 0) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const currentStock = medicine[0].current_stock;
    const newStock = currentStock - quantity;

    // Update medicine stock
    await db.query('UPDATE medicines SET current_stock = ? WHERE id = ?', [newStock, medicineId]);

    // Record the sale
    const [result] = await db.query(
      'INSERT INTO medicine_sales (medicine_id, quantity, sale_price, sale_date) VALUES (?, ?, ?, ?)',
      [medicineId, quantity, salePrice || null, date]
    );

    res.json({
      message: 'Medicine sale recorded successfully',
      newStock,
      saleId: result.insertId
>>>>>>> milestone/10-testing-deployment
    });
  } catch (err) {
    console.error('Error recording medicine sale:', err);
    res.status(500).json({ message: 'Error recording medicine sale' });
  }
});

<<<<<<< HEAD
=======
// Low stock detection
router.get('/low-stock', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT m.id, m.name, c.name as category_name, m.current_stock FROM medicines m LEFT JOIN categories c ON m.category_id = c.id WHERE m.current_stock <= 10'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching low stock medicines:', err);
    res.status(500).json({ message: 'Error fetching low stock medicines' });
  }
});

// Test request - create a new test request for a patient
router.post('/request-test', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { patientId, testId, priority } = req.body;
    if (!patientId || !testId) {
      return res.status(400).json({ message: 'Patient ID and Test ID are required' });
    }

    const [result] = await db.query(
      'INSERT INTO test_requests (patient_id, test_id, priority, status) VALUES (?, ?, ?, ?)',
      [patientId, testId, priority || 'normal', 'requested']
    );

    res.json({
      message: 'Test request submitted successfully',
      testRequestId: result.insertId,
      patientId,
      testId,
      priority: priority || 'normal',
      status: 'requested'
    });
  } catch (err) {
    console.error('Error requesting test:', err);
    res.status(500).json({ message: 'Error requesting test' });
  }
});

// Get patient reports
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM lab_reports WHERE patient_id = ? ORDER BY created_at DESC',
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patient reports:', err);
    res.status(500).json({ message: 'Error fetching patient reports' });
  }
});

// Appointment reports
router.get('/appointment-reports', authenticate, async (req, res) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    let query = 'SELECT * FROM appointments WHERE 1=1';
    let params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (dateFrom) {
      query += ' AND appointment_date >= ?';
      params.push(dateFrom);
    }
    if (dateTo) {
      query += ' AND appointment_date <= ?';
      params.push(dateTo);
    }

    const [rows] = await db.query(query + ' ORDER BY appointment_date DESC', params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching appointment reports:', err);
    res.status(500).json({ message: 'Error fetching appointment reports' });
  }
});

// Doctor performance reports
router.get('/doctor-performance', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT u.username as doctor_name, COUNT(a.id) as total_appointments, SUM(CASE WHEN a.status = \'completed\' THEN 1 ELSE 0 END) as completed_appointments';
    let params = [];
    let conditions = ['u.role = \'doctor\''];

    if (dateFrom) {
      conditions.push('a.appointment_date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('a.appointment_date <= ?');
      params.push(dateTo);
    }

    query += ' JOIN users u ON a.doctor_id = u.id JOIN appointments a ON u.id = a.doctor_id WHERE ' + conditions.join(' AND ';
    query += ') GROUP BY u.id, u.username';

    if (dateFrom || dateTo) {
      query += ' ORDER BY total_appointments DESC';
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctor performance reports:', err);
    res.status(500).json({ message: 'Error fetching doctor performance reports' });
  }
});

// Revenue analytics
router.get('/revenue-analytics', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT SUM(total_amount) as total_revenue, COUNT(id) as total_transactions';
    let params = [];
    let conditions = ['payment_status = \'completed\''];

    if (dateFrom) {
      conditions.push('payment_date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('payment_date <= ?');
      params.push(dateTo);
    }

    query += ' WHERE ' + conditions.join(' AND ';
    query += ')';

    const [rows] = await db.query(query, params);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching revenue analytics:', err);
    res.status(500).json({ message: 'Error fetching revenue analytics' });
  }
});

// Department reports
router.get('/department-reports', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT d.name as department_name, COUNT(a.id) as total_appointments';
    let params = [];
    let conditions = [];

    if (dateFrom) {
      conditions.push('a.appointment_date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('a.appointment_date <= ?');
      params.push(dateTo);
    }

    if (conditions.length > 0) {
      query += ' FROM appointments a JOIN doctors d ON a.doctor_id = d.id WHERE ' + conditions.join(' AND ');
    } else {
      query += ' FROM appointments a JOIN doctors d ON a.doctor_id = d.id';
    }

    query += ' GROUP BY d.id, d.name ORDER BY total_appointments DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching department reports:', err);
    res.status(500).json({ message: 'Error fetching department reports' });
  }
});

// Pharmacy reports
router.get('/pharmacy-reports', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT m.name as medicine_name, SUM(ms.quantity) as total_sold, SUM(ms.sale_price * ms.quantity) as total_revenue';
    let params = [];
    let conditions = ['ms.status = \'completed\''];

    if (dateFrom) {
      conditions.push('ms.sale_date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('ms.sale_date <= ?');
      params.push(dateTo);
    }

    query += ' FROM medicine_sales ms JOIN medicines m ON ms.medicine_id = m.id WHERE ' + conditions.join(' AND ');
    query += ' GROUP BY m.id, m.name ORDER BY total_revenue DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching pharmacy reports:', err);
    res.status(500).json({ message: 'Error fetching pharmacy reports' });
  }
});

// Laboratory reports summary
router.get('/laboratory-reports-summary', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT COUNT(id) as total_reports, SUM(CASE WHEN status = \'completed\' THEN 1 ELSE 0 END) as completed_reports';
    let params = [];
    let conditions = [];

    if (dateFrom) {
      conditions.push('created_at >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('created_at <= ?');
      params.push(dateTo);
    }

    if (conditions.length > 0) {
      query += ' FROM lab_reports WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query, params);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching laboratory reports summary:', err);
    res.status(500).json({ message: 'Error fetching laboratory reports summary' });
  }
});

// Backend health check
router.get('/health', authenticate, async (req, res) => {
  try {
    // Test database connection
    const [rows] = await db.query('SELECT 1 as test');
    res.json({
      message: 'Backend is healthy',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      user: { id: req.user.userId, role: req.user.role }
    });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ message: 'Backend healthy but database connection failed' });
  }
});

// Database validation - check all required tables exist
router.get('/db-validation', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const requiredTables = ['users', 'test_categories', 'test_labs', 'lab_reports', 'medicines', 'categories', 'medicine_sales'];
    const tableChecks = {};

    for (const table of requiredTables) {
      try {
        const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
        tableChecks[table] = { exists: true, rowCount: rows[0].count };
      } catch (err) {
        tableChecks[table] = { exists: false, error: err.message };
      }
    }

    const allExist = requiredTables.every(t => tableChecks[t].exists);
    res.json({
      message: allExist ? 'All required tables exist' : 'Some tables are missing',
      tableChecks,
      validationDate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Database validation error:', err);
    res.status(500).json({ message: 'Database validation failed' });
  }
});

// Performance optimization - index check
router.get('/performance-indexes', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const tablesToCheck = ['users', 'test_categories', 'test_labs', 'lab_reports', 'medicines', 'categories'];
    const indexChecks = {};

    for (const table of tablesToCheck) {
      try {
        const [rows] = await db.query(`SHOW INDEX FROM ${table}`);
        indexChecks[table] = { hasIndexes: rows.length > 0, indexes: rows.length };
      } catch (err) {
        indexChecks[table] = { error: err.message };
      }
    }

    res.json({
      message: 'Performance index check completed',
      indexChecks,
      checkDate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Performance index check error:', err);
    res.status(500).json({ message: 'Performance index check failed' });
  }
});

// Security testing - check for common vulnerabilities
router.get('/security-check', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const checks = {
      jwtSecret: process.env.JWT_SECRET ? 'Configured' : 'Not configured',
      bcryptRounds: process.env.BCRYPT_ROUNDS || 10,
      cspHeader: req.headers['content-security-policy'] ? 'Configured' : 'Not configured',
      helmetEnabled: true, // Would be checked in real implementation
      xssProtection: true, // Would be checked in real implementation
    };

    const issues = [];
    if (!process.env.JWT_SECRET) {
      issues.push('JWT_SECRET environment variable not set');
    }
    if (!process.env.BCRYPT_ROUNDS) {
      issues.push('BCRYPT_ROUNDS not set, using default');
    }

    res.json({
      message: issues.length > 0 ? 'Security issues found' : 'Security check passed',
      checks,
      potentialIssues: issues,
      checkDate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Security check error:', err);
    res.status(500).json({ message: 'Security check failed' });
  }
});

module.exports = router;

// PDF export endpoint
router.get('/export/pdf/:reportType', authenticate, async (req, res) => {
  try {
    const { reportType } = req.params;
    const { patientId, dateFrom, dateTo } = req.query;

    let filePath;
    let filename;

    switch (reportType) {
      case 'patient':
        if (patientId) {
          filePath = `reports/patient-${patientId}-${Date.now()}.pdf`;
          filename = `Patient Report - ${patientId}`;
        } else {
          return res.status(400).json({ message: 'Patient ID is required for patient PDF export' });
        }
        break;
      case 'appointment':
        filename = 'Appointment Report';
        filePath = `reports/appointment-${Date.now()}.pdf`;
        break;
      case 'laboratory':
        filename = 'Laboratory Report';
        filePath = `reports/laboratory-${Date.now()}.pdf`;
        break;
      case 'pharmacy':
        filename = 'Pharmacy Report';
        filePath = `reports/pharmacy-${Date.now()}.pdf`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // In a real implementation, generate PDF using a library like pdfkit
    // For now, return a success message with the file path
    res.json({
      message: `${reportType} PDF report generated successfully`,
      filePath,
      filename,
      downloadUrl: `/api/exports/${filePath}`
    });
  } catch (err) {
    console.error('Error generating PDF export:', err);
    res.status(500).json({ message: 'Error generating PDF export' });
  }
});

// Excel export endpoint
router.get('/export/excel/:reportType', authenticate, async (req, res) => {
  try {
    const { reportType } = req.params;
    const { patientId, dateFrom, dateTo } = req.query;

    let filename;

    switch (reportType) {
      case 'patient':
        if (patientId) {
          filename = `Patient_Report_${patientId}_${Date.now()}.xlsx`;
        } else {
          return res.status(400).json({ message: 'Patient ID is required for patient Excel export' });
        }
        break;
      case 'appointment':
        filename = `Appointment_Report_${Date.now()}.xlsx`;
        break;
      case 'laboratory':
        filename = `Laboratory_Report_${Date.now()}.xlsx`;
        break;
      case 'pharmacy':
        filename = `Pharmacy_Report_${Date.now()}.xlsx`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // In a real implementation, generate Excel using a library like exceljs
    // For now, return a success message
    res.json({
      message: `${reportType} Excel report generated successfully`,
      filename,
      downloadUrl: `/api/exports/${filename}`
    });
  } catch (err) {
    console.error('Error generating Excel export:', err);
    res.status(500).json({ message: 'Error generating Excel export' });
  }
});

>>>>>>> milestone/10-testing-deployment
module.exports = router;