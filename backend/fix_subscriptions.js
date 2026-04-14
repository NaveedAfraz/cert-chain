const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

async function fixSubscriptions() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [institutions] = await conn.query("SELECT id FROM Institutions");
    
    // Future date: 1 year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const expiresAt = oneYearFromNow.toISOString().slice(0, 19).replace('T', ' ');

    let inserted = 0;
    for (const inst of institutions) {
      // Check if subscription exists
      const [existing] = await conn.query("SELECT id FROM Subscriptions WHERE institution_id = ?", [inst.id]);
      
      if (existing.length === 0) {
        await conn.query(
          "INSERT INTO Subscriptions (id, institution_id, plan_name, expires_at) VALUES (?, ?, 'ENTERPRISE', ?)",
          [crypto.randomUUID(), inst.id, expiresAt]
        );
        inserted++;
      } else {
        await conn.query(
          "UPDATE Subscriptions SET expires_at = ?, plan_name = 'ENTERPRISE' WHERE institution_id = ?",
          [expiresAt, inst.id]
        );
      }
    }
    
    console.log(`Successfully fixed subscriptions for ${institutions.length} institutions. Inserted ${inserted} new records.`);
  } catch(e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

fixSubscriptions();
