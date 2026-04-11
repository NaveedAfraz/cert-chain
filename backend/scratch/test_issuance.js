async function testIssuance() {
    const BASE_URL = 'http://localhost:5000/api';
    
    try {
        console.log('--- Phase 5 Cross-Check: Testing Issuance Flow ---');

        // 1. Login as College Admin
        console.log('Logging in as Dr. Jane Smith...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'jane@global.edu',
                password: 'college123'
            })
        });

        const loginData = await loginRes.json();
        
        if (!loginRes.ok) throw new Error(`Login Failed: ${loginData.message}`);

        const token = loginData.token;
        console.log('✓ Login Successful. Token obtained.');

        // 2. Issue Certificate
        console.log('Issuing certificate for Student: Naveed Afraz...');
        const issueRes = await fetch(`${BASE_URL}/certificates/issue`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                studentEmail: 'student@example.com',
                studentName: 'Naveed Afraz',
                courseName: 'Full Stack SaaS Development'
            })
        });

        const issueData = await issueRes.json();
        if (!issueRes.ok) throw new Error(`Issuance Failed: ${issueData.message}`);

        console.log('✓ Issuance Successful!');
        
        // Log basic info (hiding the long QR string for clarity)
        const { qrCode, ...rest } = issueData.certificate;
        console.log('Certificate Metadata:', rest);
        console.log('QR Code (Data URL) Received: [TRUNCATED]');

        // 3. Verify the issued certificate
        const certId = issueData.certificate.id;
        console.log(`Verifying Certificate: ${certId}...`);
        const verifyRes = await fetch(`${BASE_URL}/certificates/verify/${certId}`);
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) throw new Error(`Verification Failed: ${verifyData.message}`);
        
        console.log('✓ Verification Successful!');
        console.log('Blockchain Proof:', verifyData.blockchain);

        console.log('\n--- CROSS-CHECK COMPLETE: Phase 5 is WORKING! ---');
    } catch (error) {
        console.error('✖ Cross-Check Failed!');
        console.error('Reason:', error.message);
        console.error('\nNOTE: Ensure your backend server is running on http://localhost:5000 and your Hardhat node is active.');
    }
}

testIssuance();
