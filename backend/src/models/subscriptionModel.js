const db = require('../config/db');

const createSubscription = async (id, institutionId, planName = 'TRIAL', expiresAt) => {
    const [result] = await db.query(
        'INSERT INTO Subscriptions (id, institution_id, plan_name, expires_at) VALUES (?, ?, ?, ?)',
        [id, institutionId, planName, expiresAt]
    );
    return result;
};

const getSubscriptionByInstitutionId = async (institutionId) => {
    const [rows] = await db.query('SELECT * FROM Subscriptions WHERE institution_id = ?', [institutionId]);
    return rows[0];
};

module.exports = {
    createSubscription,
    getSubscriptionByInstitutionId
};
