const express = require('express');
const { 
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
} = require('../controllers/institutionController');
const { authMiddleware, institutionMiddleware, adminMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// PUBLIC (no auth)
router.get('/directory', getPublicDirectory);
router.get('/profile/:slug', getPublicProfile);

router.post('/', authMiddleware, superAdminMiddleware, addInstitution);
router.get('/', authMiddleware, superAdminMiddleware, getInstitutions);
router.get('/stats', authMiddleware, institutionMiddleware, getInstitutionStats);
router.get('/global-stats', authMiddleware, superAdminMiddleware, getGlobalStats);

// Institutional Management
router.get('/my', authMiddleware, adminMiddleware, getMyInstitution);
router.patch('/my', authMiddleware, adminMiddleware, updateMyInstitution);
router.get('/my/users', authMiddleware, adminMiddleware, getInstitutionMembers);
router.post('/my/users', authMiddleware, adminMiddleware, addInstitutionMember);
router.delete('/my/users/:userId', authMiddleware, adminMiddleware, removeInstitutionMember);

module.exports = router;
