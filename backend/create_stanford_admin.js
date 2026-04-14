const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

async function createInstitutionAdmin() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await conn.query("SELECT id FROM Institutions WHERE name = 'Stanford University' LIMIT 1");
    if (rows.length === 0) {
      console.log('Stanford missing');
      return;
    }
    const stanfordId = rows[0].id;
    const adminId = crypto.randomUUID();
    const membershipId = crypto.randomUUID();
    
    // Hash for "password" = $2b$10$f36ueu2siakzDNs2uh149.SVH/aPGqLgIFcKQb5VErfJtahlc2Y8O (Wait, this is password123, letting keep it the same)
    const hash = '$2b$10$f36ueu2siakzDNs2uh149.SVH/aPGqLgIFcKQb5VErfJtahlc2Y8O';
    
    await conn.query("INSERT INTO Users (id, full_name, email, password_hash, is_super_admin) VALUES (?, ?, ?, ?, ?)", [
      adminId,
      'Stanford Registrar',
      'stanford@certchain.com',
      hash,
      0
    ]);
    
    await conn.query("INSERT INTO InstitutionMembers (id, user_id, institution_id, role) VALUES (?, ?, ?, ?)", [
      membershipId,
      adminId,
      stanfordId,
      'ADMIN'
    ]);
    
    console.log('Stanford Admin Created: stanford@certchain.com / password123');
  } catch(e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

createInstitutionAdmin();
