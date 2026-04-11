const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log(`Creating database ${process.env.DB_NAME} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    // Drop tables for clean SaaS refactor
    console.log('Dropping existing tables for clean setup...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DROP TABLE IF EXISTS Subscriptions;');
    await connection.query('DROP TABLE IF EXISTS VerificationLogs;');
    await connection.query('DROP TABLE IF EXISTS BlockchainTransactions;');
    await connection.query('DROP TABLE IF EXISTS Certificates;');
    await connection.query('DROP TABLE IF EXISTS InstitutionMembers;');
    await connection.query('DROP TABLE IF EXISTS Users;');
    await connection.query('DROP TABLE IF EXISTS Institutions;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await connection.query(schema);
    console.log('Database and tables initialized successfully.');
    
    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDB();
