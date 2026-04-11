const db = require('../config/db');

const createInstitution = async (id, name, slug, logoUrl = null) => {
    const [result] = await db.query(
        'INSERT INTO Institutions (id, name, slug, logo_url) VALUES (?, ?, ?, ?)',
        [id, name, slug, logoUrl]
    );
    return result;
};

const getAllInstitutions = async () => {
    const [rows] = await db.query('SELECT * FROM Institutions ORDER BY created_at DESC');
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
