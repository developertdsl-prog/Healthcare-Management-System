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

// --- Billing Routes ---

// Generate invoice
router.get('/invoice/:appointmentId', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const [appointment] = await db.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time_slot, a.status, a.consultation_fee,
        p.name as patient_name, p.id as patient_id_short,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Calculate totals - consultation fee + potential lab charges + medicine charges
    const [labTests] = await db.query(
      'SELECT SUM(amount) as total_lab_charges FROM lab_requests WHERE appointment_id = ? AND status = "completed"',
      [appointmentId]
    );
    
    const [medicineSales] = await db.query(
      'SELECT SUM(total_price) as total_medicine_charges FROM medicine_sales WHERE appointment_id = ?',
      [appointmentId]
    );
    
    const consultationFee = appointment[0].consultation_fee || 0;
    const labCharges = labTests[0].total_lab_charges || 0;
    const medicineCharges = medicineSales[0].total_medicine_charges || 0;
    const totalAmount = consultationFee + labCharges + medicineCharges;
    
    // Apply discounts if authorized (5% for example)
    const discountPercentage = 0.05; // 5% discount
    const discountAmount = Math.round(totalAmount * discountPercentage);
    const finalAmount = totalAmount - discountAmount;
    
    res.json({
      invoice: {
        appointmentId: appointment[0].id,
        patientName: appointment[0].patient_name,
        patientId: appointment[0].patient_id_short,
        doctorName: `${appointment[0].doctor_first_name} ${appointment[0].doctor_last_name}`,
        specialization: appointment[0].specialization || 'General',
        date: appointment[0].date,
        timeSlot: appointment[0].time_slot,
        consultationFee: consultationFee,
        labCharges: labCharges,
        medicineCharges: medicineCharges,
        subtotal: totalAmount,
        discountPercentage: discountPercentage * 100,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        status: appointment[0].status,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ message: 'Error generating invoice' });
  }
});

// Get payment history
router.get('/payments/history', authenticate, authorize(['admin', 'receptionist']), async (req, res) => {
  try {
    const { patientId, startDate, endDate } = req.query;
    
    let query = `SELECT py.*, p.name as patient_name, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                   a.date as appointment_date, a.time_slot
                   FROM payments py
                   JOIN patients p ON py.patient_id = p.id
                   LEFT JOIN appointments a ON py.appointment_id = a.id
                   LEFT JOIN doctors d ON a.doctor_id = d.id`;
    const params = [];
    const conditions = [];
    
    if (patientId) {
      conditions.push('py.patient_id = ?');
      params.push(patientId);
    }
    if (startDate) {
      conditions.push('py.payment_date >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('py.payment_date <= ?');
      params.push(endDate);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY py.payment_date DESC';
    
    const [rows] = await db.query(query, params);
    res.json({ payments: rows });
  } catch (err) {
    console.error('Error fetching payment history:', err);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// Process payment
router.post('/payment', authenticate, authorize(['admin', 'receptionist']), async (req, res) => {
  try {
    const { appointmentId, patientId, amount, paymentMethod } = req.body;
    
    if (!appointmentId || !patientId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Appointment ID, patient ID, amount, and payment method are required' });
    }
    
    // Verify patient
    const [patient] = await db.query('SELECT id, name FROM patients WHERE id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Verify appointment
    const [appointment] = await db.query(
      'SELECT id, status, consultation_fee FROM appointments WHERE id = ? AND patient_id = ?',
      [appointmentId, patientId]
    );
    
    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found or does not belong to this patient' });
    }
    
    // Check if already paid
    if (appointment[0].status === 'paid') {
      return res.status(409).json({ message: 'This appointment has already been paid' });
    }
    
    const [result] = await db.query(
      'INSERT INTO payments (id, appointment_id, patient_id, amount, payment_method, payment_date, status) VALUES (?, ?, ?, ?, ?, NOW(), "completed")',
      [
        `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        appointmentId,
        patientId,
        amount,
        paymentMethod
      ]
    );
    
    // Update appointment status to paid
    await db.query(
      'UPDATE appointments SET status = "paid" WHERE id = ?',
      [appointmentId]
    );
    
    res.json({
      message: 'Payment processed successfully',
      paymentId: result.insertId,
      amount: amount,
      paymentMethod: paymentMethod,
      appointmentStatus: 'paid'
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// Get receivables (unpaid appointments)
router.get('/receivables', authenticate, authorize(['admin', 'receptionist']), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time_slot, a.consultation_fee,
        p.name as patient_name, p.id as patient_id_short,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       WHERE a.status != 'paid'
       ORDER BY a.date DESC`
    );
    
    res.json({ receivables: rows });
  } catch (err) {
    console.error('Error fetching receivables:', err);
    res.status(500).json({ message: 'Error fetching receivables' });
  }
});

// Get revenue report
router.get('/report/revenue', authenticate, authorize(['admin']), async (req, const startDate, endDate) = req.query;
  let query = `SELECT DATE(payment_date) as payment_day, SUM(amount) as daily_total, COUNT(*) as payment_count
               FROM payments
               WHERE payment_date IS NOT NULL`;
  const params = [];
  const conditions = [];
  
  if (startDate) {
    conditions.push('payment_date >= ?');
    params.push(startDate);
  }
  if (endDate) {
    conditions.push('payment_date <= ?');
    params.push(endDate);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' GROUP BY DATE(payment_date) ORDER BY payment_day';
  
  const [rows] = await db.query(query, params);
  res.json({ revenueReport: rows });
});