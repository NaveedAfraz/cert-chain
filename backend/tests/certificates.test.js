const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('../src/config/db');

const app = express();
app.use(bodyParser.json());

const certRoutes = require('../src/routes/certRoutes');
const authRoutes = require('../src/routes/authRoutes');
app.use('/api/certificates', certRoutes);
app.use('/api/auth', authRoutes);

describe('Certificates & Plan Limits API', () => {
    let adminToken = '';
    let institutionId = '';
    let adminId = '';

    beforeAll(async () => {
        await global.clearDatabase();
        
        // Setup an institution and get token
        const signup = await request(app)
            .post('/api/auth/signup-institution')
            .send({
                institutionName: 'Limit Test Univ',
                fullName: 'Limit Admin',
                email: 'limit@test.com',
                password: 'password123'
            });
        
        adminToken = signup.body.token;
        institutionId = signup.body.user.institutionId;
        adminId = signup.body.user.id;
    });

    test('POST /api/certificates/issue - Should issue certificate successfully', async () => {
        const response = await request(app)
            .post('/api/certificates/issue')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                studentEmail: 'student@test.com',
                studentName: 'Test Student',
                courseName: 'Blockchain 101'
            });

        expect(response.status).toBe(201);
        expect(response.body.certificate.blockchain.txHash).toMatch(/^0x/);
    });

    test('Verification Flow - GET /api/certificates/verify/:id', async () => {
        // First issue one
        const issueRes = await request(app)
            .post('/api/certificates/issue')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                studentEmail: 'verify@test.com',
                studentName: 'Verify Student',
                courseName: 'Full Stack'
            });
        
        const certId = issueRes.body.certificate.id;

        const verifyRes = await request(app).get(`/api/certificates/verify/${certId}`);
        expect(verifyRes.status).toBe(200);
        expect(verifyRes.body.status).toBe('SUCCESS');
    });

    test('Plan Limits - Should reject issuance when limit is reached', async () => {
        // Manually insert enough certificates to hit the limit (100 for TRIAL)
        // We'll insert 99 more (we already issued 2 above)
        const mockCerts = Array.from({ length: 99 }, () => [
            uuidv4(), institutionId, adminId, 'S', 'E', 'C', 'H' + uuidv4(), new Date()
        ]);

        await db.query(
            'INSERT INTO Certificates (id, institution_id, issuer_id, student_name, student_email, course_name, cert_hash, issue_date) VALUES ?',
            [mockCerts]
        );

        // Try to issue one more (102nd)
        const response = await request(app)
            .post('/api/certificates/issue')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                studentEmail: 'overlimit@test.com',
                studentName: 'Over Limit',
                courseName: 'Test'
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toContain('Plan limit reached');
        expect(response.body.limitReached).toBe(true);
    });
});
