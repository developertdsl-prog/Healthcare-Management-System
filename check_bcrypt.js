try {
  const bcrypt = require('bcrypt');
  console.log('bcrypt available, version ok');
} catch(e) {
  console.log('bcrypt not available:', e.message);
}