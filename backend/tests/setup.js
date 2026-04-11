const db = require('../src/config/db');

// Mock uuid
let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `123e4567-e89b-12d3-a456-${(mockUuidCounter++).toString().padStart(12, '0')}`
}));

// Global beforeAll/afterAll for database
afterAll(async () => {
    // Keep connection alive for multiple tests but eventually close pool
    // await db.end(); 
});

// Helper to clear DB tables
global.clearDatabase = async () => {
    const tables = [
        'VerificationLogs',
        'BlockchainTransactions',
        'Certificates',
        'Subscriptions',
        'InstitutionMembers',
        'Users',
        'Institutions'
    ];
    
    // Disable foreign key checks for easy truncation
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of tables) {
        await db.query(`TRUNCATE TABLE ${table}`);
    }
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
};
