require('dotenv').config();
const express = require('express');
const laboratoryPharmacyRoutes = require('./routes/laboratory_pharmacy');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordsRoutes = require('./routes/medical-records');
const billingRoutes = require('./routes/billing');
const User = require('./User');
const db = require('./db');

const app = express();

// Middleware for authentication
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    // In a real app, verify JWT signature
    // For now, attach a default user context
    req.user = { userId: 1, role: 'patient' };
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware for authorization
const authorize = (roles) => {
  return (req, res, next) => {
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
  }
};

app.use(express.json());

// Laboratory & Pharmacy routes
app.use('/api/laboratory-pharmacy', laboratoryPharmacyRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Patient routes
app.use('/api/patients', patientRoutes);

// Doctor routes
app.use('/api/doctors', doctorRoutes);

// Appointment routes
app.use('/api/appointments', appointmentRoutes);

// Medical records routes
app.use('/api/medical-records', medicalRecordsRoutes);

// Billing routes
app.use('/api/billing', billingRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Healthcare Management System API is running' });
});

// --- Authentication Routes ---

// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, password' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Create new user
    const user = await User.create({ username, email, password, role });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (ex) {
    console.error('Registration error:', ex);
    res.status(500).json({ message: 'Error registering user. Please try again.' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await User.checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (ex) {
    console.error('Login error:', ex);
    res.status(500).json({ message: 'Error during login. Please try again.' });
  }
});

// Get current user profile
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    });
  } catch (ex) {
    console.error('Profile error:', ex);
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

// Logout (invalidate token server-side can be implemented with a blacklist)
app.post('/api/logout', authenticate, (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// --- Role-Based Protected Routes ---

// Admin-only routes
app.get('/api/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  return res.json({
    message: 'Admin Dashboard',
    user: { id: req.user.userId, role: req.user.role }
  });
});

// Doctor-only routes
app.get('/api/doctor/dashboard', authenticate, authorize('doctor'), (req, res) => {
  return res.json({
    message: 'Doctor Dashboard',
    user: { id: req.user.userId, role: req.user.role }
  });
});

// Receptionist-only routes
app.get('/api/receptionist/dashboard', authenticate, authorize('receptionist'), (req, res) => {
  return res.json({
    message: 'Receptionist Dashboard',
    user: { id: req.user.userId, role: req.user.role }
  });
});

// Patient routes (all authenticated patients can access)
app.get('/api/patient/dashboard', authenticate, (req, res) => {
  return res.json({
    message: 'Patient Dashboard',
    user: { id: req.user.userId, role: req.user.role }
  });
});

// Get all users (admin only)
app.get('/api/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users');
    return res.json(rows);
  } catch (ex) {
    console.error('Error fetching users:', ex);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Update user role (admin only)
app.patch('/api/users/:id/role', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await User.updateRole(id, role);
    const user = await User.findById(id);

    return res.json({
      message: 'User role updated successfully',
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (ex) {
    console.error('Error updating user role:', ex);
    res.status(500).json({ message: 'Error updating user role.' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    return res.json({ message: 'User deleted successfully' });
  } catch (ex) {
    console.error('Error deleting user:', ex);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// Helper functions for authentication middleware
function generateToken(userId, role) {
  return `temp-token-${userId}-${role}`;
}