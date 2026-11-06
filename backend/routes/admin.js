const express = require('express');
const router = express.Router();
const db = require('../db');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [patients] = await db.query('SELECT COUNT(*) as count FROM patients');
    const [doctors] = await db.query('SELECT COUNT(*) as count FROM doctors');
    const [staff] = await db.query('SELECT COUNT(*) as count FROM staff');
    const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments');
    const [todayAppointments] = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURDATE()'
    );
    const [revenue] = await db.query(
      'SELECT IFNULL(SUM(total_amount), 0) as total FROM invoices'
    );

    const stats = {
      totalPatients: patients[0].count,
      totalDoctors: doctors[0].count,
      totalStaff: staff[0].count,
      totalAppointments: appointments[0].count,
      todayAppointments: todayAppointments[0].count,
      totalRevenue: revenue[0].total,
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get department statistics
router.get('/departments', async (req, res) => {
  try {
    // Get doctor counts by department
    const [doctorsByDept] = await db.query(
      'SELECT d.department, COUNT(d.id) as count FROM doctors d GROUP BY d.department'
    );
    
    const [patientByDept] = await db.query(`
      SELECT p.department, COUNT(p.id) as count 
      FROM patients p GROUP BY p.department
    `);

    const departments = [
      ...doctorsByDept.map(d => ({ ...d, type: 'doctor' })),
      ...patientByDept.map(p => ({ ...p, type: 'patient' }))
    ];

    // If no data, provide defaults
    if (departments.length === 0) {
      departments.push(
        { name: 'Cardiology', count: 5, type: 'doctor' },
        { name: 'Neurology', count: 3, type: 'doctor' },
        { name: 'Pediatrics', count: 8, type: 'patient' },
        { name: 'General Practice', count: 15, type: 'patient' }
      );
    }

    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Error fetching department statistics' });
  }
});

// Get recent patients
router.get('/recent-patients', async (req, res) => {
  try {
    const [patients] = await db.query(
      'SELECT id, username, email, created_at FROM patients ORDER BY created_at DESC LIMIT 5'
    );
    const recentPatients = patients.map(p => ({
      id: p.id,
      name: p.username,
      email: p.email,
      joined: p.created_at,
    }));
    res.json(recentPatients);
  } catch (err) {
    console.error('Error fetching recent patients:', err);
    res.status(500).json({ message: 'Error fetching recent patients' });
  }
});

// Get recent activities
router.get('/activities', async (req, res) => {
  try {
    // Get recent appointment changes, user registrations, etc.
    const [recentAppointments] = await db.query(
      'SELECT id, patient_id, doctor_id, status, appointment_date, created_at FROM appointments ORDER BY created_at DESC LIMIT 5'
    );
    
    const activities = recentAppointments.map(a => ({
      description: `Appointment ${a.status} for patient ${a.patient_id} with doctor ${a.doctor_id}`,
      time: new Date(a.created_at).toLocaleString(),
    }));

    // If no appointments, add some sample activities
    if (activities.length === 0) {
      activities.push(
        { description: 'New user registered: Dr. Smith', time: 'Just now' },
        { description: 'Patient registration completed', time: '2 hours ago' },
        { description: 'Appointment scheduled', time: 'Yesterday' }
      );
    }

    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Error fetching recent activities' });
  }
});

module.exports = router;