const db = require('../config/db');

const createInstitution = async (id, name, slug, logoUrl = null) => {
    const [result] = await db.query(
        'INSERT INTO Institutions (id, name, slug, logo_url) VALUES (?, ?, ?, ?)',
        [id, name, slug, logoUrl]
    );
    return result;
};

const getAllInstitutions = async () => {
    const [rows] = await db.query(`
        SELECT i.*, 
               (SELECT COUNT(*) FROM InstitutionMembers im WHERE im.institution_id = i.id) as staff_count,
               (SELECT COUNT(*) FROM ApiKeys ak WHERE ak.institution_id = i.id) as api_key_count
        FROM Institutions i 
        ORDER BY i.created_at DESC
    `);
    return rows;
};

const getInstitutionById = async (id) => {
    const [rows] = await db.query('SELECT * FROM Institutions WHERE id = ?', [id]);
    return rows[0];
};

const getInstitutionBySlug = async (slug) => {
    const [rows] = await db.query('SELECT * FROM Institutions WHERE slug = ?', [slug]);
    return rows[0];
};

module.exports = {
    createInstitution,
    getAllInstitutions,
    getInstitutionById,
    getInstitutionBySlug
};
