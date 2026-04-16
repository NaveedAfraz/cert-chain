const express = require('express');
const { generateApiKey, listApiKeys, revokeApiKey } = require('../controllers/apiKeyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require auth + admin role
router.post('/', authMiddleware, adminMiddleware, generateApiKey);
router.get('/', authMiddleware, adminMiddleware, listApiKeys);
router.delete('/:keyId', authMiddleware, adminMiddleware, revokeApiKey);

module.exports = router;
