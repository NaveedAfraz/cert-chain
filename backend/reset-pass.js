const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function main() {
    console.log("Connecting to Aiven Cloud DB...");
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log("\n=== USERS IN DATABASE ===");
    const [users] = await db.execute('SELECT email, full_name, is_super_admin FROM Users');
    console.table(users);

    const newHash = await bcrypt.hash('12341234', 10);
    await db.execute('UPDATE Users SET password_hash = ?', [newHash]);
    console.log("\n✅ ALL user passwords have been successfully reset to: 12341234");

    await db.end();
}

main().catch(console.error);
