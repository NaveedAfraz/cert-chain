const db = require('../src/config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

async function seed() {
    console.log("🚀 Starting Final SaaS Demo Seeding...");

    try {
        const passwordHash = await bcrypt.hash('password123', 10);
        
        const institutions = [
            { name: 'Stanford University', slug: 'stanford-edu' },
            { name: 'MIT Institute', slug: 'mit-tech' },
            { name: 'MGM University', slug: 'mgm-uni' }
        ];

        // 1. Disable FK Checks for atomic cleanup
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log("🧹 Cleaning up old demo data...");
        for (const inst of institutions) {
            await db.query('DELETE FROM Users WHERE email = ?', [`admin@${inst.slug}.edu`]);
            await db.query('DELETE FROM Institutions WHERE slug = ?', [inst.slug]);
        }
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Fresh Seed
        for (const instData of institutions) {
            const instId = uuidv4();
            console.log(`Creating ${instData.name}...`);
            await db.query('INSERT INTO Institutions (id, name, slug) VALUES (?, ?, ?)', [instId, instData.name, instData.slug]);

            const userId = uuidv4();
            const adminEmail = `admin@${instData.slug}.edu`;
            await db.query('INSERT INTO Users (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)', 
                [userId, `${instData.name} Admin`, adminEmail, passwordHash]);

            await db.query('INSERT INTO InstitutionMembers (id, user_id, institution_id, role) VALUES (?, ?, ?, ?)', 
                [uuidv4(), userId, instId, 'ADMIN']);

            const subId = uuidv4();
            const expires = new Date();
            expires.setDate(expires.getDate() + 30);
            await db.query('INSERT INTO Subscriptions (id, institution_id, plan_name, expires_at) VALUES (?, ?, ?, ?)', 
                [subId, instId, 'TRIAL', expires]);

            const certs = [
                { id: uuidv4(), name: `${instData.name} Graduate 1`, email: `grad1@${instData.slug}.edu`, course: 'B.Sc. Computer Science' },
                { id: uuidv4(), name: `${instData.name} Graduate 2`, email: `grad2@${instData.slug}.edu`, course: 'M.Tech AI' },
                { id: uuidv4(), name: `${instData.name} Graduate 3`, email: `grad3@${instData.slug}.edu`, course: 'Data Science' }
            ];

            for (const cert of certs) {
                const certHash = require('crypto').createHash('sha256').update(cert.name + cert.email + cert.course + Date.now()).digest('hex');
                
                await db.query(
                    'INSERT INTO Certificates (id, institution_id, issuer_id, student_name, student_email, course_name, cert_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [cert.id, instId, userId, cert.name, cert.email, cert.course, certHash]
                );

                await db.query(
                    'INSERT INTO BlockchainTransactions (id, certificate_id, tx_hash, block_number) VALUES (?, ?, ?, ?)',
                    [uuidv4(), cert.id, '0x' + require('crypto').randomBytes(32).toString('hex'), 1234567]
                );

                await db.query(
                    'INSERT INTO VerificationLogs (id, certificate_id, institution_id, result) VALUES (?, ?, ?, ?)',
                    [uuidv4(), cert.id, instId, 'SUCCESS']
                );
            }
        }

        const [anyCertRows] = await db.query('SELECT id, institution_id FROM Certificates ORDER BY RAND() LIMIT 1');
        if (anyCertRows.length > 0) {
            await db.query(
                'INSERT INTO VerificationLogs (id, certificate_id, institution_id, result) VALUES (?, ?, ?, ?)',
                [uuidv4(), anyCertRows[0].id, anyCertRows[0].institution_id, 'TAMPERED']
            );
        }

        console.log("✅ Seeding Complete! Platform is ready for Demonstration.");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Failed:", error);
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        process.exit(1);
    }
}

seed();
