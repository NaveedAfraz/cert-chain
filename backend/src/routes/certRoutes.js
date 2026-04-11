const express = require('express');
const { 
    issueCertificate, 
    verifyCertificate, 
    getInstitutionCertificates,
    getCertificateDetails,
    revokeCertificate
} = require('../controllers/certController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { checkSubscriptionLimit } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

// Institution Management
router.post('/issue', authMiddleware, adminMiddleware, checkSubscriptionLimit, issueCertificate);
router.get('/my', authMiddleware, adminMiddleware, getInstitutionCertificates);
router.get('/details/:id', authMiddleware, adminMiddleware, getCertificateDetails);
router.post('/revoke/:id', authMiddleware, adminMiddleware, revokeCertificate);

// Public verification
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;
