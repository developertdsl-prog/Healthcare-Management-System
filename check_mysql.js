const { execSync } = require('child_process');
try {
  const list = execSync('sc query mysql', { encoding: 'utf8' });
  console.log('MySQL service output:', list.substring(0, 200));
} catch(e) {
  console.error('Error checking MySQL service:', e.message);
}
try {
  const start = execSync('net start mysql', { encoding: 'utf8', timeout: 5000 });
  console.log('MySQL started:', start);
} catch(e) {
  console.error('Error starting MySQL:', e.message);
}