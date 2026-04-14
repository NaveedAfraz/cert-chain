const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSeed() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log(`Connected to database ${process.env.DB_NAME}. Applying seed...`);
    
    // First clear existing Certificates, Institutions, Users to avoid issues
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE BlockchainTransactions;');
    await connection.query('TRUNCATE TABLE VerificationLogs;');
    await connection.query('TRUNCATE TABLE Certificates;');
    await connection.query('TRUNCATE TABLE Subscriptions;');
    await connection.query('TRUNCATE TABLE InstitutionMembers;');
    await connection.query("DELETE FROM Users WHERE email = 'admin@certchain.com';");
    await connection.query('TRUNCATE TABLE Institutions;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    const seedPath = path.join(__dirname, 'seed_data', 'seed_kaggle_data.sql');
    const sql = fs.readFileSync(seedPath, 'utf8');

    await connection.query(sql);
    console.log('Seed data applied successfully!');

  } catch (err) {
    console.error('Error applying seed:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSeed();
