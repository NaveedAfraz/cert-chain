const db = require('../config/db');

const createUser = async (id, fullName, email, passwordHash, role = 'STUDENT') => {
    const [result] = await db.query(
        'INSERT INTO Users (id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [id, fullName, email, passwordHash, role]
    );
    return result;
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
};

const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
    return rows[0];
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById
};
