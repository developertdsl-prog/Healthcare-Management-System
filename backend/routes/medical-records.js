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
    // For now, attach user based on role from the token context
    // The req.user would be set by the authentication middleware in server.js
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

// --- Medical Records Routes ---

// Get patient's medical records
router.get('/patient/:patientId', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const [rows] = await db.query(
      `SELECT mr.id, mr.patient_id, mr.diagnosis, mr.symptoms, mr.treatment_details, 
        mr.prescription_notes, mr.doctor_notes, mr.visit_date, mr.created_at,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name
       FROM medical_records mr
       LEFT JOIN doctors d ON mr.doctor_id = d.id
       WHERE mr.patient_id = ?
       ORDER BY mr.visit_date DESC
       LIMIT ? OFFSET ?`,
      [patientId, parseInt(limit), parseInt(offset)]
    );
    
    const [count] = await db.query(
      'SELECT COUNT(*) as total FROM medical_records WHERE patient_id = ?',
      [patientId]
    );
    
    res.json({
      records: rows,
      total: count[0].total
    });
  } catch (err) {
    console.error('Error fetching medical records:', err);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
});

// Get single medical record
router.get('/:recordId', authenticate, authorize(['admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const { recordId } = req.params;
    
    const [rows] = await db.query(
      `SELECT mr.id, mr.patient_id, mr.diagnosis, mr.symptoms, mr.treatment_details, 
        mr.prescription_notes, mr.doctor_notes, mr.visit_date, mr.created_at,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p.name as patient_name, p.id as patient_id_short
       FROM medical_records mr
       LEFT JOIN doctors d ON mr.doctor_id = d.id
       LEFT JOIN patients p ON mr.patient_id = p.id
       WHERE mr.id = ?`,
      [recordId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching medical record:', err);
    res.status(500).json({ message: 'Error fetching medical record' });
  }
});

// Create new medical record
router.post('/', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { patientId, diagnosis, symptoms, treatmentDetails, doctorNotes, prescriptionNotes } = req.body;
    
    if (!patientId || !diagnosis) {
      return res.status(400).json({ message: 'Patient ID and diagnosis are required' });
    }
    
    // Verify patient exists
    const [patient] = await db.query('SELECT id, name FROM patients WHERE id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const visitDate = new Date().toISOString().split('T')[0];
    
    const [result] = await db.query(
      `INSERT INTO medical_records (id, patient_id, doctor_id, diagnosis, symptoms, treatment_details, prescription_notes, doctor_notes, visit_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        `MR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        patientId,
        req.user.userId,
        diagnosis,
        symptoms || '',
        treatmentDetails || '',
        prescriptionNotes || '',
        doctorNotes || '',
        visitDate
      ]
    );
    
    const [newRecord] = await db.query(
      `SELECT mr.id, mr.patient_id, mr.diagnosis, mr.symptoms, mr.treatment_details, 
        mr.prescription_notes, mr.doctor_notes, mr.visit_date, mr.created_at,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p.name as patient_name, p.id as patient_id_short
       FROM medical_records mr
       LEFT JOIN doctors d ON mr.doctor_id = d.id
       LEFT JOIN patients p ON mr.patient_id = p.id
       WHERE mr.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newRecord[0]);
  } catch (err) {
    console.error('Error creating medical record:', err);
    res.status(500).json({ message: 'Error creating medical record' });
  }
});

// Update medical record
router.patch('/:recordId', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { recordId } = req.params;
    const { diagnosis, symptoms, treatmentDetails, doctorNotes, prescriptionNotes } = req.body;
    
    const updateFields = [];
    const updateParams = [];
    
    if (diagnosis) {
      updateFields.push('diagnosis = ?');
      updateParams.push(diagnosis);
    }
    if (symptoms !== undefined) {
      updateFields.push('symptoms = ?');
      updateParams.push(symptoms);
    }
    if (treatmentDetails !== undefined) {
      updateFields.push('treatment_details = ?');
      updateParams.push(treatmentDetails);
    }
    if (doctorNotes !== undefined) {
      updateFields.push('doctor_notes = ?');
      updateParams.push(doctorNotes);
    }
    if (prescriptionNotes !== undefined) {
      updateFields.push('prescription_notes = ?');
      updateParams.push(prescriptionNotes);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    updateParams.push(recordId);
    
    await db.query(
      `UPDATE medical_records SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );
    
    const [updatedRecord] = await db.query(
      `SELECT mr.id, mr.patient_id, mr.diagnosis, mr.symptoms, mr.treatment_details, 
        mr.prescription_notes, mr.doctor_notes, mr.visit_date, mr.created_at,
        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p.name as patient_name, p.id as patient_id_short
       FROM medical_records mr
       LEFT JOIN doctors d ON mr.doctor_id = d.id
       LEFT JOIN patients p ON mr.patient_id = p.id
       WHERE mr.id = ?`,
      [recordId]
    );
    
    res.json(updatedRecord[0]);
  } catch (err) {
    console.error('Error updating medical record:', err);
    res.status(500).json({ message: 'Error updating medical record' });
  }
});

// --- Prescription Routes ---

// Get prescriptions for a patient
router.get('/prescriptions/patient/:patientId', authenticate, authorize(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // Patients can only see their own prescriptions, doctors/admin can see any
    let query = '';
    const params = [];
    
    if (req.user.role === 'patient') {
      query = `SELECT p.id, p.diagnosis, p.treatment_details, p.prescription_notes, p.medicine_dosage, 
                p.medicine_frequency, p.treatment_duration, p.prescription_instructions, p.created_at,
                mr.visit_date, d.first_name as doctor_first_name, d.last_name as doctor_last_name
                FROM prescriptions p
                LEFT JOIN medical_records mr ON p.medical_record_id = mr.id
                LEFT JOIN doctors d ON mr.doctor_id = d.id
                WHERE p.patient_id = ?
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`;
      params = [patientId, parseInt(limit), parseInt(offset)];
    } else {
      query = `SELECT p.id, p.patient_id, p.medical_record_id, p.diagnosis, p.treatment_details, 
                p.prescription_notes, p.medicine_dosage, p.medicine_frequency, p.treatment_duration, 
                p.prescription_instructions, p.created_at,
                mr.visit_date, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                p2.name as patient_name
                FROM prescriptions p
                LEFT JOIN medical_records mr ON p.medical_record_id = mr.id
                LEFT JOIN doctors d ON mr.doctor_id = d.id
                LEFT JOIN patients p2 ON p.patient_id = p2.id
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`;
      params = [parseInt(limit), parseInt(offset)];
    }
    
    const [rows] = await db.query(query, params);
    
    const [count] = await db.query(
      req.user.role === 'patient'
        ? 'SELECT COUNT(*) as total FROM prescriptions WHERE patient_id = ?'
        : 'SELECT COUNT(*) as total FROM prescriptions'
    );
    
    const totalParams = req.user.role === 'patient' ? [patientId] : [];
    const totalCount = await db.query(query.replace('LIMIT ? OFFSET ?', ''), totalParams);
    
    res.json({
      prescriptions: rows,
      total: totalCount[0] ? totalCount[0].total : 0
    });
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

// Get single prescription
router.get('/prescriptions/:prescId', authenticate, authorize(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const { prescId } = req.params;
    
    const [rows] = await db.query(
      `SELECT p.id, p.patient_id, p.medical_record_id, p.diagnosis, p.treatment_details, 
        p.prescription_notes, p.medicine_dosage, p.medicine_frequency, p.treatment_duration, 
        p.prescription_instructions, p.created_at,
        mr.visit_date, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p2.name as patient_name
        FROM prescriptions p
        LEFT JOIN medical_records mr ON p.medical_record_id = mr.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        LEFT JOIN patients p2 ON p.patient_id = p2.id
        WHERE p.id = ?`,
      [prescId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Check permissions - patient can only see their own
    if (req.user.role === 'patient' && rows[0].patient_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. This is not your prescription.' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching prescription:', err);
    res.status(500).json({ message: 'Error fetching prescription' });
  }
});

// Create new prescription
router.post('/prescriptions', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { patientId, medicalRecordId, diagnosis, medicineDosage, medicineFrequency, treatmentDuration, prescriptionInstructions } = req.body;
    
    if (!patientId || !diagnosis) {
      return res.status(400).json({ message: 'Patient ID and diagnosis are required' });
    }
    
    // Verify patient exists
    const [patient] = await db.query('SELECT id, name FROM patients WHERE id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Verify medical record exists and belongs to this patient
    let recordCheck = '';
    if (req.user.role === 'patient') {
      recordCheck = 'WHERE mr.patient_id = ? AND mr.id = ?';
    } else {
      recordCheck = 'WHERE mr.id = ?';
    }
    
    const [record] = await db.query(
      `SELECT id FROM medical_records mr ${recordCheck}`,
      [patientId, medicalRecordId || null]
    );
    
    if (record.length === 0) {
      return res.status(404).json({ message: 'Medical record not found or does not belong to this patient' });
    }
    
    const [result] = await db.query(
      `INSERT INTO prescriptions (id, patient_id, medical_record_id, diagnosis, medicine_dosage, medicine_frequency, treatment_duration, prescription_instructions, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        `RX-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        patientId,
        medicalRecordId || null,
        diagnosis,
        medicineDosage || '',
        medicineFrequency || '',
        treatmentDuration || '',
        prescriptionInstructions || ''
      ]
    );
    
    const [newPresc] = await db.query(
      `SELECT p.id, p.patient_id, p.medical_record_id, p.diagnosis, p.treatment_details, 
        p.prescription_notes, p.medicine_dosage, p.medicine_frequency, p.treatment_duration, 
        p.prescription_instructions, p.created_at,
        mr.visit_date, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p2.name as patient_name
        FROM prescriptions p
        LEFT JOIN medical_records mr ON p.medical_record_id = mr.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        LEFT JOIN patients p2 ON p.patient_id = p2.id
        WHERE p.id = ?`,
      [result.insertId]
    ];
    
    res.status(201).json(newPresc[0]);
  } catch (err) {
    console.error('Error creating prescription:', err);
    res.status(500).json({ message: 'Error creating prescription' });
  }
});

// Update prescription
router.patch('/prescriptions/:prescId', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  try {
    const { prescId } = req.params;
    { medicineDosage, medicineFrequency, treatmentDuration, prescriptionInstructions } = req.body;
    
    const updateFields = [];
    const updateParams = [];
    
    if (medicineDosage !== undefined) {
      updateFields.push('medicine_dosage = ?');
      updateParams.push(medicineDosage);
    }
    if (medicineFrequency !== undefined) {
      updateFields.push('medicine_frequency = ?');
      updateParams.push(medicineFrequency);
    }
    if (treatmentDuration !== undefined) {
      updateFields.push('treatment_duration = ?');
      updateParams.push(treatmentDuration);
    }
    if (prescriptionInstructions !== undefined) {
      updateFields.push('prescription_instructions = ?');
      updateParams.push(prescriptionInstructions);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    updateParams.push(prescId);
    
    await db.query(
      `UPDATE prescriptions SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );
    
    const [updatedPresc] = await db.query(
      `SELECT p.id, p.patient_id, p.medical_record_id, p.diagnosis, p.treatment_details, 
        p.prescription_notes, p.medicine_dosage, p.medicine_frequency, p.treatment_duration, 
        p.prescription_instructions, p.created_at,
        mr.visit_date, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
        p2.name as patient_name
        FROM prescriptions p
        LEFT JOIN medical_records mr ON p.medical_record_id = mr.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        LEFT JOIN patients p2 ON p.patient_id = p2.id
        WHERE p.id = ?`,
      [prescId]
    );
    
    res.json(updatedPresc[0]);
  } catch (err) {
    console.error('Error updating prescription:', err);
    res.status(500).json({ message: 'Error updating prescription' });
  }
});

module.exports = router;