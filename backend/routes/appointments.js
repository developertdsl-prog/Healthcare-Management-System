const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to parse JSON bodies
router.use(express.json());

// Get all appointments with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const doctorId = req.query.doctorId || '';
    const patientId = req.query.patientId || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.date, a.time_slot, a.status, a.notes, a.created_at, a.updated_at, ';
    query += 'p.name as patient_name, p.id as patient_id_short, ';
    query += 'd.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization ';
    query += 'FROM appointments a ';
    query += 'LEFT JOIN patients p ON a.patient_id = p.id ';
    query += 'LEFT JOIN doctors d ON a.doctor_id = d.id ';
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push('(p.name LIKE ? OR d.first_name LIKE ? OR d.last_name LIKE ? OR a.id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status && status !== 'all') {
      conditions.push('a.status = ?');
      params.push(status);
    }
    if (doctorId) {
      conditions.push('a.doctor_id = ?');
      params.push(doctorId);
    }
    if (patientId) {
      conditions.push('a.patient_id = ?');
      params.push(patientId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id LEFT JOIN doctors d ON a.doctor_id = d.id ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`;
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0].total;
    
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.query(query, params);
    
    res.json({
      appointments: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.date, a.time_slot, a.status, a.notes, a.created_at, a.updated_at, ` +
      `p.name as patient_name, p.bloodGroup, p.phone as patient_phone, ` +
      `d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization, d.consultation_fee ` +
      `FROM appointments a ` +
      `LEFT JOIN patients p ON a.patient_id = p.id ` +
      `LEFT JOIN doctors d ON a.doctor_id = d.id ` +
      `WHERE a.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Book new appointment
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, departmentId, date, timeSlot, notes } = req.body;
    
    if (!patientId || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Patient ID, Doctor ID, date, and time slot are required' });
    }
    
    // Check if doctor is available at this time
    const [conflicting] = await db.query(
      'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time_slot = ? AND status != \"cancelled\"',
      [doctorId, date, timeSlot]
    );
    
    if (conflicting.length > 0) {
      return res.status(409).json({ message: 'Doctor is not available at this time slot. Please select a different time.' });
    }
    
    // Check if patient already has an appointment at this time
    const [patientConflict] = await db.query(
      'SELECT id FROM appointments WHERE patient_id = ? AND date = ? AND status != "cancelled"',
      [patientId, date]
    );
    
    if (patientConflict.length > 0) {
      return res.status(409).json({ message: 'Patient already has an appointment on this date. Please reschedule or cancel the existing appointment.' });
    }
    
    // Get doctor details to calculate total fee
    const [doctorDetails] = await db.query(
      'SELECT consultation_fee FROM doctors WHERE id = ?',
      [doctorId]
    );
    
    const consultationFee = doctorDetails.length > 0 ? doctorDetails[0].consultation_fee : 0;
    
    const [result] = await db.query(
      'INSERT INTO appointments (id, patient_id, doctor_id, department_id, date, time_slot, status, notes, consultation_fee, created_at) VALUES (?, ?, ?, ?, ?, ?, "scheduled", ?, ?, NOW())',
      [generateAppointmentId(), patientId, doctorId, departmentId || null, date, timeSlot, notes || '', consultationFee]
    );
    
    const [newAppointment] = await db.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.date, a.time_slot, a.status, a.notes, a.consultation_fee, a.created_at, ` +
      `p.name as patient_name, p.bloodGroup, p.phone as patient_phone, ` +
      `d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization, d.consultation_fee ` +
      `FROM appointments a ` +
      `LEFT JOIN patients p ON a.patient_id = p.id ` +
      `LEFT JOIN doctors d ON a.doctor_id = d.id ` +
      `WHERE a.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newAppointment[0]);
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// Update appointment status (approve/reject/reschedule)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['scheduled', 'approved', 'completed', 'cancelled', 'rescheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    await db.query(
      'UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );
    
    const [updated] = await db.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.date, a.time_slot, a.status, a.notes, a.consultation_fee, a.created_at, ` +
      `p.name as patient_name, p.bloodGroup, p.phone as patient_phone, ` +
      `d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization, d.consultation_fee ` +
      `FROM appointments a ` +
      `LEFT JOIN patients p ON a.patient_id = p.id ` +
      `LEFT JOIN doctors d ON a.doctor_id = d.id ` +
      `WHERE a.id = ?`,
      [req.params.id]
    );
    
    if (updated.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE appointments SET status = "cancelled", updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

// Get appointments by doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    let query = 'SELECT a.id, a.patient_id, a.date, a.time_slot, a.status, a.notes, a.consultation_fee, ';
    query += 'p.name as patient_name, p.bloodGroup, p.phone as patient_phone FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id WHERE a.doctor_id = ?';
    const params = [doctorId];
    
    if (date) {
      query += ' AND a.date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.time_slot';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({ message: 'Error fetching doctor appointments' });
  }
});

// Get appointments by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;
    
    let query = 'SELECT a.id, a.doctor_id, a.date, a.time_slot, a.status, a.notes, a.consultation_fee FROM appointments a WHERE a.patient_id = ?';
    const params = [patientId];
    
    if (date) {
      query += ' AND a.date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.date DESC, a.time_slot';
    
    const [rows] = await db.query(query, params);
    
    // Get doctor details for each appointment
    const appointmentsWithDoctor = await Promise.all(rows.map(async (apt) => {
      const [doctor] = await db.query(
        'SELECT first_name, last_name, specialization FROM doctors WHERE id = ?',
        [apt.doctor_id]
      );
      return {
        ...apt,
        doctor_name: doctor.length > 0 ? `${doctor[0].first_name} ${doctor[0].last_name}` : 'Unknown',
        doctor_specialization: doctor.length > 0 ? doctor[0].specialization : ''
      };
    }));
    
    res.json(appointmentsWithDoctor);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ message: 'Error fetching patient appointments' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/available-slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }
    
    // Get existing appointments for this doctor on this date
    const [existing] = await db.query(
      'SELECT time_slot, status FROM appointments WHERE doctor_id = ? AND date = ? AND status != "cancelled"',
      [doctorId, date]
    );
    
    // Define available time slots (9 AM to 5 PM, 30-minute slots)
    const allSlots = [];
    let currentTime = new Date(date + 'T09:00:00');
    const endTime = new Date(date + 'T17:00:00');
    
    while (currentTime < endTime) {
      const slot = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      allSlots.push(slot);
      currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30 minutes
    }
    
    // Remove slots that have appointments
    const bookedSlots = new Set(existing.map(a => a.time_slot));
    const availableSlots = allSlots.filter(slot => !bookedSlots.has(slot));
    
    res.json({ availableSlots, bookedSlots: Array.from(bookedSlots) });
  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ message: 'Error fetching available time slots' });
  }
});

function generateAppointmentId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const time = date.getTime().toString().slice(-6);
  return `APP-${year}${month}${day}-${time}`;
}

module.exports = router;