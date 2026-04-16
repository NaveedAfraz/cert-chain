require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    const db = await mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'certchain',
        port: process.env.DB_PORT || 3306
    });

    console.log('Creating ApiKeys table...');
    await db.query(`
        CREATE TABLE IF NOT EXISTS ApiKeys (
            id CHAR(36) PRIMARY KEY,
            institution_id CHAR(36) NOT NULL,
            key_prefix VARCHAR(8) NOT NULL,
            key_hash VARCHAR(255) NOT NULL,
            label VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            last_used_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE
        );
    `);
    console.log('Done!');
    process.exit(0);
}

migrate();
