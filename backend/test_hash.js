const mysql = require('mysql2/promise');
require('dotenv').config();
const { generateCertHash } = require('./src/utils/hash');

async function testHash() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await conn.query("SELECT * FROM Certificates WHERE id = '46a2beb1-0d24-4422-af6f-7074972d3a9a'");
    if (rows.length === 0) {
      console.log('Cert not found.');
      return;
    }
    const cert = rows[0];
    console.log('--- Database Record ---');
    console.log(cert);
    console.log('issue_date from DB type:', typeof cert.issue_date);
    console.log('issue_date from DB value:', cert.issue_date);
    console.log('issue_date getTime():', cert.issue_date.getTime());
    
    // Hash manually
    const email = cert.student_email.trim().toLowerCase();
    const name = cert.student_name.trim();
    const course = cert.course_name.trim();
    const normalizedTime = Math.floor(new Date(cert.issue_date).getTime() / 1000) * 1000;
    const rawData = `${email}|${name}|${course}|${normalizedTime}`;
    
    console.log('--- Hashing Info ---');
    console.log('Raw string:', rawData);
    const correctHash = require('crypto').createHash('sha256').update(rawData).digest('hex');
    
    console.log('Calculated Hash:', correctHash);
    console.log('cert_hash in DB:', cert.cert_hash);
    console.log('Match?', correctHash === cert.cert_hash);
    
  } catch(e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

testHash();
