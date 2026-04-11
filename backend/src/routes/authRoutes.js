const express = require('express');
const { register, login, signupInstitution, bootstrap } = require('../controllers/authController');

const router = express.Router();

router.post('/signup-institution', signupInstitution);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
