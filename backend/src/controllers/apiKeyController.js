const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../config/db');

/**
 * Generate a new API key for an institution
 * Returns the raw key ONCE — it's stored hashed
 */
const generateApiKey = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const { label } = req.body;

        if (!label) {
            return res.status(400).json({ message: 'Label is required' });
        }

        // Generate a secure random key: ck_live_xxxxxxxxxxxxxxxx
        const rawKey = `ck_live_${crypto.randomBytes(24).toString('hex')}`;
        const keyPrefix = rawKey.substring(0, 12); // ck_live_xxxx
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        const id = uuidv4();
        await db.query(
            'INSERT INTO ApiKeys (id, institution_id, key_prefix, key_hash, label) VALUES (?, ?, ?, ?, ?)',
            [id, institutionId, keyPrefix, keyHash, label]
        );

        // Return the raw key ONLY this one time
        res.status(201).json({
            message: 'API key generated successfully',
            apiKey: {
                id,
                label,
                key: rawKey,           // Only shown once!
                prefix: keyPrefix,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.error('Error generating API key:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * List all API keys for the institution (prefix only, not the actual key)
 */
const listApiKeys = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const [keys] = await db.query(
            'SELECT id, label, key_prefix, is_active, last_used_at, created_at FROM ApiKeys WHERE institution_id = ? ORDER BY created_at DESC',
            [institutionId]
        );
        res.json(keys);
    } catch (error) {
        console.error('Error listing API keys:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Revoke (deactivate) an API key
 */
const revokeApiKey = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const { keyId } = req.params;

        await db.query(
            'UPDATE ApiKeys SET is_active = FALSE WHERE id = ? AND institution_id = ?',
            [keyId, institutionId]
        );
        res.json({ message: 'API key revoked successfully' });
    } catch (error) {
        console.error('Error revoking API key:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Middleware: Authenticate requests using API key
 * Expects header: x-api-key: ck_live_xxxxxxxx
 */
const apiKeyAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key required. Pass via x-api-key header.' });
        }

        const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
        const [rows] = await db.query(
            `SELECT ak.*, i.id as inst_id, i.name as inst_name, i.slug as inst_slug 
             FROM ApiKeys ak
             JOIN Institutions i ON ak.institution_id = i.id
             WHERE ak.key_hash = ? AND ak.is_active = TRUE AND i.is_active = TRUE`,
            [keyHash]
        );

        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Invalid or revoked API key' });
        }

        const keyRecord = rows[0];

        // Update last_used_at
        await db.query('UPDATE ApiKeys SET last_used_at = NOW() WHERE id = ?', [keyRecord.id]);

        // Attach institution context to request
        req.apiKeyAuth = true;
        req.user = {
            institutionId: keyRecord.institution_id,
            institutionName: keyRecord.inst_name,
            role: 'API_KEY'
        };

        next();
    } catch (error) {
        console.error('API key auth error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generateApiKey,
    listApiKeys,
    revokeApiKey,
    apiKeyAuth
};
