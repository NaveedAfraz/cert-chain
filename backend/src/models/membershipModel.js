const db = require('../config/db');

const addMember = async (id, userId, institutionId, role = 'STAFF') => {
    const [result] = await db.query(
        'INSERT INTO InstitutionMembers (id, user_id, institution_id, role) VALUES (?, ?, ?, ?)',
        [id, userId, institutionId, role]
    );
    return result;
};

const getMembershipsByUserId = async (userId) => {
    const [rows] = await db.query(
        `SELECT m.*, i.name as institution_name, i.slug as institution_slug 
         FROM InstitutionMembers m
         JOIN Institutions i ON m.institution_id = i.id
         WHERE m.user_id = ?`,
        [userId]
    );
    return rows;
};

const getMembersByInstitutionId = async (institutionId) => {
    const [rows] = await db.query(
        `SELECT m.*, u.full_name, u.email 
         FROM InstitutionMembers m
         JOIN Users u ON m.user_id = u.id
         WHERE m.institution_id = ?`,
        [institutionId]
    );
    return rows;
};

module.exports = {
    addMember,
    getMembershipsByUserId,
    getMembersByInstitutionId
};
