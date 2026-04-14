const mysql = require('mysql2/promise');
require('dotenv').config();
const { generateCertHash } = require('./src/utils/hash');

async function fixHashes() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [certs] = await conn.query("SELECT * FROM Certificates");
    
    let updated = 0;
    for (const cert of certs) {
      const correctHash = generateCertHash(cert.student_email, cert.student_name, cert.course_name, cert.issue_date);
      
      if (cert.cert_hash !== correctHash) {
        await conn.query("UPDATE Certificates SET cert_hash = ? WHERE id = ?", [correctHash, cert.id]);
        updated++;
      }
    }
    
    console.log(`Successfully fixed ${updated} certificate hashes to match correct email|name schema.`);
  } catch(e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

fixHashes();
