const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../config/db');
const { generateCertHash } = require('../utils/hash');
const { certificateStoreContract } = require('../services/blockchain');

const issueCertificate = async (req, res) => {
    try {
        const { studentEmail, studentName, courseName } = req.body;
        const issuerId = req.user.id; 
        const institutionId = req.user.institutionId; 

        if (!studentEmail || !studentName || !courseName || !institutionId) {
            return res.status(400).json({ message: 'Missing fields or institution identification' });
        }

        // Trim inputs for hash stability
        const sEmail = studentEmail.trim();
        const sName = studentName.trim();
        const cName = courseName.trim();

        const certId = uuidv4();
        // Floor to the nearest second to match DB storage precision and avoid rounding mismatches
        const issueDate = new Date(Math.floor(Date.now() / 1000) * 1000);

        const certHash = generateCertHash(sEmail, sName, cName, issueDate);

        console.log(`Writing certHash: ${certHash} to blockchain...`);
        const tx = await certificateStoreContract.issueCertificate(certHash, institutionId);
        const receipt = await tx.wait(); 

        await db.query(
            `INSERT INTO Certificates (id, institution_id, issuer_id, student_name, student_email, course_name, cert_hash, issue_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [certId, institutionId, issuerId, studentName, studentEmail, courseName, certHash, issueDate]
        );

        await db.query(
            `INSERT INTO BlockchainTransactions (id, certificate_id, tx_hash, block_number) 
             VALUES (?, ?, ?, ?)`,
            [uuidv4(), certId, receipt.hash, receipt.blockNumber]
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verificationUrl = `${frontendUrl}/verify/${certId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        res.status(201).json({ 
            message: 'Certificate issued successfully', 
            certificate: {
                id: certId,
                studentName,
                studentEmail,
                courseName,
                issueDate,
                certHash,
                blockchain: {
                    txHash: receipt.hash,
                    blockNumber: receipt.blockNumber
                },
                qrCode: qrCodeDataUrl
            }
        });
    } catch (error) {
        console.error('Issuance Error:', error);
        res.status(500).json({ message: 'Error during issuance', error: error.message || error });
    }
};

const getInstitutionCertificates = async (req, res) => {
    try {
        const institutionId = req.user.institutionId;
        const [rows] = await db.query(
            `SELECT c.*, t.tx_hash, t.block_number 
             FROM Certificates c 
             LEFT JOIN BlockchainTransactions t ON c.id = t.certificate_id
             WHERE c.institution_id = ? 
             ORDER BY c.issue_date DESC`,
            [institutionId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificates' });
    }
};

const getCertificateDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const institutionId = req.user.institutionId;

        const [rows] = await db.query(
            `SELECT c.*, i.name as institution_name, t.tx_hash, t.block_number 
             FROM Certificates c 
             JOIN Institutions i ON c.institution_id = i.id
             LEFT JOIN BlockchainTransactions t ON c.id = t.certificate_id
             WHERE c.id = ? AND c.institution_id = ?`,
            [id, institutionId]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });

        const cert = rows[0];
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verificationUrl = `${frontendUrl}/verify/${cert.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        res.json({ ...cert, qrCode: qrCodeDataUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching details' });
    }
};

const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const [rows] = await db.query(
            `SELECT c.*, i.name as institution_name, i.logo_url, t.tx_hash, t.block_number 
             FROM Certificates c 
             JOIN Institutions i ON c.institution_id = i.id 
             LEFT JOIN BlockchainTransactions t ON c.id = t.certificate_id
             WHERE c.id = ?`, 
            [certificateId]
        );
        
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Certificate record not found in database', status: 'INVALID' });
        }

        const cert = rows[0];

        if (cert.is_revoked) {
             return res.json({ message: 'This certificate has been revoked', status: 'REVOKED', data: cert });
        }

        const recalculatedHash = generateCertHash(cert.student_email, cert.student_name, cert.course_name, cert.issue_date);
        console.log(`[VERIFY] Stored hash:      ${cert.cert_hash}`);
        console.log(`[VERIFY] Recalculated hash: ${recalculatedHash}`);
        console.log(`[VERIFY] Issue date from DB: ${cert.issue_date} (type: ${typeof cert.issue_date})`);

        if (recalculatedHash !== cert.cert_hash) {
            console.log('[VERIFY] HASH MISMATCH - returning TAMPERED');
            await logVerification(certificateId, cert.institution_id, 'TAMPERED');
            return res.status(400).json({ status: 'TAMPERED' });
        }

        let isValidOnChain = false;
        let onChainInstId, onChainTimestamp;
        try {
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Blockchain call timed out after 10s')), 10000)
            );
            const result = await Promise.race([
                certificateStoreContract.verifyCertificate(cert.cert_hash),
                timeout
            ]);
            console.log('[VERIFY] Blockchain raw result:', JSON.stringify(result, (_, v) => typeof v === 'bigint' ? v.toString() : v));
            [isValidOnChain, onChainInstId, onChainTimestamp] = result;
        } catch (chainError) {
            console.error('[VERIFY] Blockchain call error:', chainError.message);
            return res.status(503).json({ message: `Blockchain error: ${chainError.message}`, status: 'ERROR' });
        }

        if (isValidOnChain) {
            await logVerification(certificateId, cert.institution_id, 'SUCCESS');
            return res.json({ 
                status: 'SUCCESS', 
                data: cert,
                blockchain: {
                    institutionId: onChainInstId ? onChainInstId.toString() : null,
                    timestamp: onChainTimestamp ? Number(onChainTimestamp) : null
                }
            });
        } else {
            await logVerification(certificateId, cert.institution_id, 'FAILED');
            return res.status(400).json({ status: 'FAILED' });
        }
    } catch (error) {
        console.error('Core Verification Error:', error);
        res.status(500).json({ message: 'Server error during verification', error: error.message });
    }
};

const revokeCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const institutionId = req.user.institutionId;

        const [rows] = await db.query('SELECT cert_hash FROM Certificates WHERE id = ? AND institution_id = ?', [id, institutionId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Certificate not found' });

        const certHash = rows[0].cert_hash;

        const tx = await certificateStoreContract.revokeCertificate(certHash);
        await tx.wait();

        await db.query('UPDATE Certificates SET is_revoked = TRUE WHERE id = ?', [id]);

        res.json({ message: 'Certificate revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Revocation failed' });
    }
};

const logVerification = async (certificateId, institutionId, result) => {
    try {
        await db.query(
            'INSERT INTO VerificationLogs (id, certificate_id, institution_id, result) VALUES (?, ?, ?, ?)',
            [uuidv4(), certificateId, institutionId, result]
        );
    } catch (e) {
        console.error("Failed to log verification", e);
    }
};

module.exports = {
    issueCertificate,
    getInstitutionCertificates,
    getCertificateDetails,
    verifyCertificate,
    revokeCertificate
};
