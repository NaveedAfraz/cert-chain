const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const institutionModel = require('../models/institutionModel');
const membershipModel = require('../models/membershipModel');
const subscriptionModel = require('../models/subscriptionModel');

const signupInstitution = async (req, res) => {
    try {
        const { institutionName, fullName, email, password } = req.body;
        
        if (!institutionName || !fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 1. Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 2. Create Institution with Auto-generated Slug
        const institutionId = uuidv4();
        const slug = institutionName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        await institutionModel.createInstitution(institutionId, institutionName, slug);

        // 3. Create Admin User
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(userId, fullName, email, hashedPassword, false);

        // 4. Assign Trial Subscription (30 days)
        const subId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await subscriptionModel.createSubscription(subId, institutionId, 'TRIAL', expiresAt);

        // 5. Create Membership
        await membershipModel.addMember(uuidv4(), userId, institutionId, 'ADMIN');

        // 6. Generate Token for Auto-login
        const token = jwt.sign(
            { 
                id: userId, 
                isSuperAdmin: false, 
                name: fullName, 
                email: email,
                institutionId: institutionId,
                role: 'ADMIN'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Institution and Admin registered successfully',
            token,
            user: {
                id: userId,
                name: fullName,
                email: email,
                isSuperAdmin: false,
                institutionId: institutionId,
                institutionName: institutionName,
                role: 'ADMIN'
            }
        });
    } catch (error) {
        console.error('Institution signup error:', error);
        res.status(500).json({ message: 'Server error: Check if the slug or email is unique' });
    }
};

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await userModel.createUser(userId, fullName, email, hashedPassword, false);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.getUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const memberships = await membershipModel.getMembershipsByUserId(user.id);
        const firstMembership = memberships[0] || null;

        const token = jwt.sign(
            { 
                id: user.id, 
                isSuperAdmin: user.is_super_admin, 
                name: user.full_name, 
                email: user.email,
                institutionId: firstMembership ? firstMembership.institution_id : null,
                role: firstMembership ? firstMembership.role : (user.is_super_admin ? 'SUPER_ADMIN' : 'USER')
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                isSuperAdmin: user.is_super_admin,
                institutionId: firstMembership ? firstMembership.institution_id : null,
                institutionName: firstMembership ? firstMembership.institution_name : null,
                role: firstMembership ? firstMembership.role : (user.is_super_admin ? 'SUPER_ADMIN' : 'USER')
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const bootstrap = async (req, res) => {
    try {
        const pass = await bcrypt.hash('admin123', 10);
        await userModel.createUser(uuidv4(), 'System Admin', 'admin@certchain.io', pass, true);
        res.send('Super Admin bootstrap complete.');
    } catch (e) {
        res.status(500).send(e.message);
    }
};

module.exports = {
    signupInstitution,
    register,
    login,
    bootstrap
};
