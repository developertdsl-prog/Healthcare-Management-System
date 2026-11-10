const pool = require('./backend/db.js');

async function setupDatabase() {
  try {
    // Create the database if it doesn't exist
    await pool.execute('CREATE DATABASE IF NOT EXISTS healthcare_management');
    console.log('Database created/verified');
    
    await pool.execute('USE healthcare_management');
    console.log('Using healthcare_management database');
    
    // Create patients table (if not already exists - based on existing implementation)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        bloodGroup VARCHAR(5) NOT NULL,
        allergies TEXT,
        phone VARCHAR(20),
        address TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Patients table created/verified');
    
    // Create departments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (name)
      )
    `);
    console.log('Departments table created/verified');
    
    // Create doctors table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50),
        specialization VARCHAR(100),
        qualifications TEXT,
        consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
        availability ENUM('available', 'busy', 'offline') DEFAULT 'available',
        department_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Doctors table created/verified');
    
    // Create staff table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50),
        role VARCHAR(50) NOT NULL,
        specialization VARCHAR(100),
        hire_date DATE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Staff table created/verified');
    
    // Create users table (if not exists - needed for auth)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor', 'receptionist', 'patient') DEFAULT 'patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created/verified');
    
    // Add indexes
    await pool.execute('CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id)');
    await pool.execute('CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role)');
    
    console.log('\nAll tables created successfully!');
    console.log('\nRun the following to verify:');
    console.log('mysql -u root healthcare_management -e "SHOW TABLES;"');
    
  } catch (err) {
    console.error('Error setting up database:', err.code || err.message);
  } finally {
    pool.end();
  }
}

setupDatabase();