const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const institutionRoutes = require('../src/routes/institutionRoutes');
const authRoutes = require('../src/routes/authRoutes');
app.use('/api/institutions', institutionRoutes);
app.use('/api/auth', authRoutes);

describe('Institution Stats & Metadata API', () => {
    let adminToken = '';
    let institutionId = '';

    beforeAll(async () => {
        await global.clearDatabase();
        
        const signup = await request(app)
            .post('/api/auth/signup-institution')
            .send({
                institutionName: 'Stats Univ',
                fullName: 'Stats Admin',
                email: 'stats@test.com',
                password: 'password123'
            });
        
        adminToken = signup.body.token;
        institutionId = signup.body.user.institutionId;
    });

    test('GET /api/institutions/stats - Should return correct stats for new institution', async () => {
        const response = await request(app)
            .get('/api/institutions/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.totalCertificates).toBe(0);
        expect(response.body.institutionName).toBe('Stats Univ');
    });

    test('RBAC - Should deny stats access to regular users', async () => {
        // Create a regular user (not admin) - Assuming a simple register exists
        const reg = await request(app)
            .post('/api/auth/register')
            .send({
                fullName: 'Regular User',
                email: 'regular@test.com',
                password: 'password123'
            });
        
        // Login to get token
        const login = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'regular@test.com',
                password: 'password123'
            });

        const userToken = login.body.token;

        const response = await request(app)
            .get('/api/institutions/stats')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
    });
});
