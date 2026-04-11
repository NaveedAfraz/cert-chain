const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./src/config/db');

async function seed() {
    try {
        console.log('Seeding Production SaaS Platform...');

        // 1. Create a Test Institution
        const instId = uuidv4();
        await db.query('INSERT INTO Institutions (id, name, slug) VALUES (?, ?, ?)', [
            instId, 
            'Global University', 
            'global-uni'
        ]);
        console.log('✓ Institution "Global University" created.');

        // 2. Create a Super Admin (Platform Owner)
        const superAdminId = uuidv4();
        const superPass = await bcrypt.hash('admin123', 10);
        await db.query('INSERT INTO Users (id, full_name, email, password_hash, is_super_admin) VALUES (?, ?, ?, ?, ?)', [
            superAdminId,
            'System Super Admin',
            'admin@certchain.io',
            superPass,
            true
        ]);
        console.log('✓ Super Admin created (admin@certchain.io / admin123).');

        // 3. Create a User for the College Admin
        const collegeAdminUserId = uuidv4();
        const collegePass = await bcrypt.hash('college123', 10);
        await db.query('INSERT INTO Users (id, full_name, email, password_hash, is_super_admin) VALUES (?, ?, ?, ?, ?)', [
            collegeAdminUserId,
            'Dr. Jane Smith',
            'jane@global.edu',
            collegePass,
            false
        ]);
        console.log('✓ User "Dr. Jane Smith" created.');

        // 4. Link User to Institution as ADMIN
        await db.query('INSERT INTO InstitutionMembers (id, user_id, institution_id, role) VALUES (?, ?, ?, ?)', [
            uuidv4(),
            collegeAdminUserId,
            instId,
            'ADMIN'
        ]);
        console.log('✓ Dr. Jane Smith linked as ADMIN of Global University.');

        console.log('SaaS Production Seeding complete. You can now login.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
