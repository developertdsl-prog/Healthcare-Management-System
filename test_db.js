const pool = require('./backend/db.js');
pool.query('SELECT 1').then(() => {
  console.log('DB connected successfully');
}).catch(err => {
  console.error('DB connection error:', err.code || err.message);
}).finally(() => {
  pool.end();
});