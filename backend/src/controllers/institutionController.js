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

        // 5. Monthly certificate issuance (last 12 months)
        const [monthlyData] = await db.query(
            `SELECT 
                DATE_FORMAT(issue_date, '%Y-%m') as month,
                COUNT(*) as count
             FROM Certificates 
             WHERE institution_id = ? AND issue_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY DATE_FORMAT(issue_date, '%Y-%m')
             ORDER BY month ASC`,
            [institutionId]
        );

        // 6. Top courses by certificate count
        const [topCourses] = await db.query(
            `SELECT course_name, COUNT(*) as count 
             FROM Certificates 
             WHERE institution_id = ? 
             GROUP BY course_name 
             ORDER BY count DESC LIMIT 5`,
            [institutionId]
        );

        // 7. Verification results breakdown
        const [verificationBreakdown] = await db.query(
            `SELECT v.result, COUNT(*) as count 
             FROM VerificationLogs v
             JOIN Certificates c ON v.certificate_id = c.id
             WHERE c.institution_id = ? 
             GROUP BY v.result`,
            [institutionId]
        );

        // 8. Recent activity (last 10 events)
        const [recentActivity] = await db.query(
            `(SELECT 'ISSUED' as type, c.student_name as detail, c.course_name as extra, c.issue_date as timestamp 
              FROM Certificates c WHERE c.institution_id = ? ORDER BY c.issue_date DESC LIMIT 5)
             UNION ALL
             (SELECT 'VERIFIED' as type, c.student_name as detail, v.result as extra, v.verified_at as timestamp 
              FROM VerificationLogs v JOIN Certificates c ON v.certificate_id = c.id 
              WHERE c.institution_id = ? ORDER BY v.verified_at DESC LIMIT 5)
             ORDER BY timestamp DESC LIMIT 10`,
            [institutionId, institutionId]
        );

        // 9. Revoked count
        const [revokedCount] = await db.query(
            'SELECT COUNT(*) as total FROM Certificates WHERE institution_id = ? AND is_revoked = TRUE',
            [institutionId]
        );

        res.json({
            institutionName: instInfo[0]?.name || 'Unknown',
            totalCertificates: certCount[0].total,
            totalVerifications: verifyCount[0].total,
            totalRevoked: revokedCount[0].total,
            subscription: subInfo[0] || { plan_name: 'NONE', expires_at: null },
            monthlyData,
            topCourses,
            verificationBreakdown,
            recentActivity
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

const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * PHASE 9: Institutional Management
 */

const getMyInstitution = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const [rows] = await db.query(
            'SELECT id, name, slug, logo_url, is_active FROM Institutions WHERE id = ?',
            [institutionId]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Institution not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching institution profile' });
    }
};

const updateMyInstitution = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const { name, logoUrl } = req.body;

        if (!name) return res.status(400).json({ message: 'Name is required' });

        await db.query(
            'UPDATE Institutions SET name = ?, logo_url = ? WHERE id = ?',
            [name, logoUrl, institutionId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating branding' });
    }
};

const getInstitutionMembers = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, im.role, u.created_at 
             FROM Users u 
             JOIN InstitutionMembers im ON u.id = im.user_id 
             WHERE im.institution_id = ?`,
            [institutionId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff records' });
    }
};

const addInstitutionMember = async (req, res) => {
    let conn;
    try {
        const institutionId = req.user.institutionId;
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        conn = await db.getConnection();
        await conn.beginTransaction();

        const userId = uuidv4();
        const hash = await bcrypt.hash(password, 10);

        // 1. Create User
        await conn.query(
            'INSERT INTO Users (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, fullName, email, hash]
        );

        // 2. Link to Institution
        await conn.query(
            'INSERT INTO InstitutionMembers (id, user_id, institution_id, role) VALUES (?, ?, ?, ?)',
            [uuidv4(), userId, institutionId, role || 'STAFF']
        );

        await conn.commit();
        res.status(201).json({ message: 'Staff member added successfully' });
    } catch (error) {
        if (conn) await conn.rollback();
        console.error('Add Member Error:', error);
        res.status(500).json({ message: error.code === 'ER_DUP_ENTRY' ? 'Email already registered' : 'Error adding staff' });
    } finally {
        if (conn) conn.release();
    }
};

const removeInstitutionMember = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const { userId } = req.params;

        if (userId === req.user.id) {
            return res.status(400).json({ message: 'Cannot remove yourself' });
        }

        await db.query(
            'DELETE FROM InstitutionMembers WHERE user_id = ? AND institution_id = ?',
            [userId, institutionId]
        );

        res.json({ message: 'User access revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing member' });
    }
};

/**
 * PUBLIC: Institution Profile by slug
 * No auth required — returns safe public stats
 */
const getPublicProfile = async (req, res) => {
    try {
        const { slug } = req.params;

        // Get institution info
        const [instRows] = await db.query(
            'SELECT id, name, slug, logo_url, created_at FROM Institutions WHERE slug = ? AND is_active = TRUE',
            [slug]
        );

        if (!instRows || instRows.length === 0) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        const inst = instRows[0];

        // Total certificates issued
        const [[certCount]] = await db.query(
            'SELECT COUNT(*) as total FROM Certificates WHERE institution_id = ? AND is_revoked = FALSE',
            [inst.id]
        );

        // Total verifications
        const [[verifyCount]] = await db.query(
            'SELECT COUNT(*) as total FROM VerificationLogs WHERE institution_id = ?',
            [inst.id]
        );

        // Top courses
        const [topCourses] = await db.query(
            `SELECT course_name, COUNT(*) as count 
             FROM Certificates WHERE institution_id = ? AND is_revoked = FALSE
             GROUP BY course_name ORDER BY count DESC LIMIT 5`,
            [inst.id]
        );

        // Monthly issuance (last 6 months)
        const [monthlyData] = await db.query(
            `SELECT DATE_FORMAT(issue_date, '%Y-%m') as month, COUNT(*) as count
             FROM Certificates WHERE institution_id = ?
             GROUP BY month ORDER BY month DESC LIMIT 6`,
            [inst.id]
        );

        // Staff count
        const [[staffCount]] = await db.query(
            'SELECT COUNT(*) as total FROM InstitutionMembers WHERE institution_id = ?',
            [inst.id]
        );

        res.json({
            institution: {
                name: inst.name,
                slug: inst.slug,
                logo_url: inst.logo_url,
                founded: inst.created_at,
            },
            stats: {
                totalCertificates: certCount.total,
                totalVerifications: verifyCount.total,
                totalStaff: staffCount.total,
                topCourses,
                monthlyData: monthlyData.reverse(),
            }
        });
    } catch (error) {
        console.error('Error fetching public profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
/**
 * PUBLIC: List all active institutions with cert counts
 */
const getPublicDirectory = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT i.name, i.slug, i.logo_url, i.created_at,
                    (SELECT COUNT(*) FROM Certificates c WHERE c.institution_id = i.id AND c.is_revoked = FALSE) as cert_count,
                    (SELECT COUNT(*) FROM VerificationLogs v WHERE v.institution_id = i.id) as verify_count
             FROM Institutions i
             WHERE i.is_active = TRUE
             ORDER BY cert_count DESC`
        );  
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching public directory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addInstitution,
    getInstitutions,
    getInstitutionStats,
    getGlobalStats,
    getMyInstitution,
    updateMyInstitution,
    getInstitutionMembers,
    addInstitutionMember,
    removeInstitutionMember,
    getPublicProfile,
    getPublicDirectory
};
