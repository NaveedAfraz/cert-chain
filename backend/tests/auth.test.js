const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

// We need an instance of the app for testing
// Since src/index.js might start a server, let's create a testable app instance
const app = express();
app.use(bodyParser.json());

// Routes
const authRoutes = require('../src/routes/authRoutes');
const institutionRoutes = require('../src/routes/institutionRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);

describe('Auth & Multi-Tenancy API', () => {
    beforeAll(async () => {
        await global.clearDatabase();
    });

    const testEmail = `admin-${uuidv4()}@test.com`;
    let adminToken = '';

    test('POST /api/auth/signup-institution - Should create institution and admin user', async () => {
        const response = await request(app)
            .post('/api/auth/signup-institution')
            .send({
                institutionName: 'Test University',
                fullName: 'Admin User',
                email: testEmail,
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('ADMIN');
        expect(response.body.user.institutionName).toBe('Test University');
        
        adminToken = response.body.token;
    });

    test('POST /api/auth/login - Should login with admin credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe(testEmail);
    });

    test('GET /api/institutions/stats - Should be protected (RBAC)', async () => {
        // No token
        const noToken = await request(app).get('/api/institutions/stats');
        expect(noToken.status).toBe(401); 

        // With token (Should be 200 since adminToken is from an ADMIN)
        const withToken = await request(app)
            .get('/api/institutions/stats')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(withToken.status).toBe(200);
        expect(withToken.body).toHaveProperty('totalCertificates');
    });
});
