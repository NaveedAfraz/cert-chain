const express = require('express');
const { 
    issueCertificate, 
    verifyCertificate, 
    getInstitutionCertificates,
    getCertificateDetails,
    revokeCertificate
} = require('../controllers/certController');
const { authMiddleware, institutionMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { checkSubscriptionLimit } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

// Institution Management
router.post('/issue', authMiddleware, institutionMiddleware, checkSubscriptionLimit, issueCertificate);
router.get('/my', authMiddleware, institutionMiddleware, getInstitutionCertificates);
router.get('/details/:id', authMiddleware, institutionMiddleware, getCertificateDetails);
router.post('/revoke/:id', authMiddleware, adminMiddleware, revokeCertificate);

// Public verification
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;
