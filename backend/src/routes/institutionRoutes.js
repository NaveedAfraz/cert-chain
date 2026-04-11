const express = require('express');
const { addInstitution, getInstitutions, getInstitutionStats, getGlobalStats } = require('../controllers/institutionController');
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, superAdminMiddleware, addInstitution);
router.get('/', authMiddleware, superAdminMiddleware, getInstitutions);
router.get('/stats', authMiddleware, adminMiddleware, getInstitutionStats);
router.get('/global-stats', authMiddleware, superAdminMiddleware, getGlobalStats);

module.exports = router;
