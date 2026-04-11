/**
 * re-anchor.js
 * Re-registers all existing certificate hashes from the database
 * into a freshly deployed blockchain contract.
 * Run this after restarting the Hardhat node.
 */

require('dotenv').config();
const { ethers } = require('ethers');
const { CERTIFICATE_STORE_ABI } = require('./src/config/abi');
const db = require('./src/config/db');

async function reAnchor() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_WSS || 'http://127.0.0.1:8546');
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CERTIFICATE_STORE_ABI, wallet);

    console.log('\n🔗 Re-anchoring certificates to new contract:', process.env.CONTRACT_ADDRESS);

    const [rows] = await db.query(
        'SELECT id, cert_hash, institution_id, is_revoked FROM Certificates ORDER BY issue_date ASC'
    );

    if (rows.length === 0) {
        console.log('✅ No certificates found in database. Nothing to re-anchor.\n');
        process.exit(0);
    }

    console.log(`📋 Found ${rows.length} certificate(s) to re-anchor...\n`);

    let success = 0;
    let failed = 0;
    
    // Get the starting nonce for the wallet
    let currentNonce = await provider.getTransactionCount(wallet.address, 'pending');

    for (const cert of rows) {
        try {
            if (cert.is_revoked) {
                console.log(`⏭  Skipping revoked certificate: ${cert.id}`);
                continue;
            }
            process.stdout.write(`  Anchoring ${cert.id.substring(0, 8)}... `);
            const tx = await contract.issueCertificate(cert.cert_hash, cert.institution_id, { nonce: currentNonce });
            await tx.wait();
            console.log(`✅`);
            success++;
            currentNonce++; // explicitly increment after successful transaction
        } catch (err) {
            if (err.message && err.message.includes('already issued')) {
                console.log(`⏭  (already on chain)`);
                currentNonce++; // Still increment if it was processed
            } else {
                console.log(`❌ FAILED: ${err.message}`);
                // Refresh nonce from network on failure to recover properly
                currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
                failed++;
            }
        }
    }

    console.log(`\n✅ Re-anchor complete. Success: ${success}, Failed: ${failed}\n`);
    process.exit(0);
}

reAnchor().catch(err => {
    console.error('Re-anchor script failed:', err);
    process.exit(1);
});
