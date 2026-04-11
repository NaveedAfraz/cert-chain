const { v4: uuidv4 } = require('uuid');
const institutionModel = require('../models/institutionModel');
const db = require('../config/db');

const addInstitution = async (req, res) => {
    try {
        const { name, email, slug } = req.body;
        if (!name || !email || !slug) {
            return res.status(400).json({ message: 'Name, email, and slug are required' });
        }

        const id = uuidv4();
        await institutionModel.createInstitution(id, name, slug);
        
        res.status(201).json({ 
            message: 'Institution created successfully', 
            institution: { id, name, slug, email } 
        });
    } catch (error) {
        console.error('Error adding institution:', error);
        res.status(500).json({ message: 'Server error: Slug might already be taken' });
    }
};

const getInstitutions = async (req, res) => {
    try {
        const institutions = await institutionModel.getAllInstitutions();
        res.json(institutions);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * PHASE 8: Institution Analytics
 * Returns cert count, verification count, and subscription details
 */
const getInstitutionStats = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;

        // 1. Get total certificates
        const [certCount] = await db.query(
            'SELECT COUNT(*) as total FROM Certificates WHERE institution_id = ?',
            [institutionId]
        );

        // 2. Get total verification attempts for this institution's certificates
        const [verifyCount] = await db.query(
            `SELECT COUNT(*) as total FROM VerificationLogs v
             JOIN Certificates c ON v.certificate_id = c.id
             WHERE c.institution_id = ?`,
            [institutionId]
        );

        // 3. Get subscription info
        const [subInfo] = await db.query(
            'SELECT plan_name, expires_at FROM Subscriptions WHERE institution_id = ?',
            [institutionId]
        );

        // 4. Get Institution Name
        const [instInfo] = await db.query(
            'SELECT name FROM Institutions WHERE id = ?',
            [institutionId]
        );

        res.json({
            institutionName: instInfo[0]?.name || 'Unknown',
            totalCertificates: certCount[0].total,
            totalVerifications: verifyCount[0].total,
            subscription: subInfo[0] || { plan_name: 'NONE', expires_at: null }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

/**
 * PHASE 8: Global SaaS Analytics (Super Admin Only)
 */
const getGlobalStats = async (req, res) => {
    try {
        // 1. Platform-wide totals
        const [instCount] = await db.query('SELECT COUNT(*) as total FROM Institutions');
        const [certCount] = await db.query('SELECT COUNT(*) as total FROM Certificates');
        
        // 2. Verification success rate
        const [logStats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN result = 'SUCCESS' THEN 1 ELSE 0 END) as success,
                SUM(CASE WHEN result = 'TAMPERED' THEN 1 ELSE 0 END) as tampered
            FROM VerificationLogs
        `);

        // 3. Top Active Institutions
        const [topInstitutions] = await db.query(`
            SELECT i.name, COUNT(c.id) as cert_count
            FROM Institutions i
            LEFT JOIN Certificates c ON i.id = c.institution_id
            GROUP BY i.id
            ORDER BY cert_count DESC
            LIMIT 5
        `);

        res.json({
            totalInstitutions: instCount[0].total,
            totalCertificates: certCount[0].total,
            verificationStats: {
                total: logStats[0].total || 0,
                success: logStats[0].success || 0,
                tampered: logStats[0].tampered || 0
            },
            topInstitutions
        });
    } catch (error) {
        console.error('Global Stats error:', error);
        res.status(500).json({ message: 'Error fetching global stats' });
    }
};

module.exports = {
    addInstitution,
    getInstitutions,
    getInstitutionStats,
    getGlobalStats
};
