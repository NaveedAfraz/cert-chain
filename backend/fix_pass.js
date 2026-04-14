const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPassword() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const hash = '$2b$10$f36ueu2siakzDNs2uh149.SVH/aPGqLgIFcKQb5VErfJtahlc2Y8O';
  await conn.query('UPDATE Users SET password_hash = ? WHERE email = ?', [hash, 'admin@certchain.com']);
  console.log('Password successfully fixed!');
  await conn.end();
}


fixPassword();