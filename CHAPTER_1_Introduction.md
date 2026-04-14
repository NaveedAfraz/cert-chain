DECLARATION

I declare that this project report titled "CertChain: Blockchain‑Anchored Credential Verification" is my original work and has not been submitted previously for any degree or qualification at any institution. All sources used have been duly acknowledged.

ACKNOWLEDGEMENT

I gratefully acknowledge the guidance and support of my supervisor, the backend and blockchain development teams, and colleagues who reviewed earlier drafts. Their feedback improved the clarity and focus of this report.

ABSTRACT

CertChain is a multi-tenant SaaS platform that issues, manages, and publicly verifies academic and professional credentials by anchoring SHA-256 hashes of certificates on an Ethereum-compatible smart contract. The platform preserves institutional data privacy while providing a tamper-evident, low-cost on-chain proof of authenticity. This chapter introduces the problem, the proposed solution, and the scope of this report. Key components include a deterministic certificate hashing scheme, a minimal on-chain anchoring contract, and REST APIs that support institutional issuance and public verification.

CHAPTER 1: INTRODUCTION

1.1 Background

Digital credentials (degrees, certificates, badges) are widely used in hiring, education, and certification. Traditional verification methods are manual and centralized, making them slow and vulnerable to forgery. Blockchains provide an immutable audit trail suitable for publishing compact proofs of authenticity while keeping sensitive records off-chain.

1.2 Problem Statement

Credential verification today suffers from three principal problems:

- Verification friction: manual requests to issuing institutions introduce delays and administrative cost.
- Forgery and tampering: copies or altered digital files can be presented as authentic.
- Privacy concerns: storing full credential data on public ledgers is unacceptable to institutions and regulators.

CertChain addresses these issues by publishing cryptographic hashes of certificates on-chain while retaining authoritative data in institutional databases.

1.3 Aim

Design and implement a privacy-preserving system that enables institutions to issue verifiable credentials anchored on a public blockchain and allows third parties to verify certificates without contacting the issuer.

1.4 Objectives

- Specify a deterministic hashing method for certificate data to ensure reproducible anchors.
- Implement a minimal smart contract to record and revoke certificate hashes.
- Provide backend APIs for issuance, revocation, and public verification.
- Define a database schema and RBAC model to support multi-tenant institutions.

1.5 Scope

This report documents the CertChain prototype: system design, database schema, smart contract interface, backend controllers, and verification flow. It does not cover production-grade CI/CD pipelines, payment processing, or native mobile clients.

1.6 System Overview

CertChain is a three-tier system:

- Presentation: React SPA for institutional users and public verification pages.
- Application: Node.js / Express backend providing REST APIs, request validation, RBAC, and blockchain integration.
- Data: MySQL database for institution data and a Solidity contract for hash anchoring.

Key runtime components:

- generateCertHash(...) — deterministic hash function used for on-chain anchoring.
- certificateStoreContract — smart contract that records and revokes certificate hashes.
- BlockchainService — provider/wallet/contract wiring (Ethers v6).
- QR/Export utilities — generate shareable verification links and PDFs.

1.7 Certificate Hashing Methodology

The system uses a deterministic hashing method so the same certificate fields always produce the same anchor.

Principles:

- Normalize email to lowercase and trim whitespace.
- Trim all text fields to avoid insignificant differences.
- Use a second-precision timestamp (milliseconds floored to seconds) for stable reproducibility.
- Concatenate fields with a fixed delimiter (|) in a fixed order.

Pseudocode:

function generateCertHash(email, name, course, issueDate)
    e = email.trim().toLowerCase()
    n = name.trim()
    c = course.trim()
    t = Math.floor(issueDate.getTime()/1000)
    raw = e + '|' + n + '|' + c + '|' + t
    return sha256(raw)  // hex string

This produces a 64-character hex SHA-256 digest used as the certificate anchor.

1.8 Smart Contract Interface (Summary)

The Solidity contract (CertificateStore) provides minimal functionality to anchor and revoke certificate hashes.

Primary functions:

- issueCertificate(string _certHash, string _institutionId) — only owner; records a timestamp and emits CertificateIssued.
- verifyCertificate(string _certHash) — view; returns (bool valid, string institutionId, uint256 timestamp).
- revokeCertificate(string _certHash) — only owner; sets isValid = false and emits CertificateRevoked.

Events:

- CertificateIssued(string indexed certHash, string institutionId, uint256 timestamp)
- CertificateRevoked(string indexed certHash, uint256 timestamp)

Backend interacts via Ethers.js with the contract ABI and CONTRACT_ADDRESS environment variable.

1.9 Verification Flow (Detailed)

Public verification proceeds as follows:

1. Retrieve certificate record from the database by certificateId (includes stored fields and stored cert_hash).
2. If not found → return INVALID.
3. Recompute the hash from the stored fields using generateCertHash(...).
4. Compare recomputed hash with stored cert_hash. If mismatch → TAMPERED.
5. Call smart contract verifyCertificate(certHash) with a short timeout.
6. If on-chain result shows valid → SUCCESS (return cert + blockchain metadata).
7. If on-chain result shows revoked → REVOKED.
8. Log the verification attempt in VerificationLogs for analytics and audit.

1.10 Security & Privacy Considerations

Threats and mitigations:

- Key compromise (owner private key): keep the deployer key in a secure HSM or vault; rotate keys if compromised.
- Database tampering: use database backups, row-level ownership checks, and application-level integrity checks (hash comparisons).
- Replay or MITM during API calls: enforce TLS, require JWT for protected endpoints, and validate inputs.
- Privacy: only hashes are stored on-chain; full PII remains in institutional databases under access control.

Operational safeguards:

- Short blockchain call timeouts to avoid blocking verification endpoints.
- Test mode exports a mock contract object to avoid using real network during unit tests.

1.11 Limitations and Future Work

- On-chain anchors are irreversible; revocation is implemented but historical anchors remain. Consider time-based revocation windows or upgradeable contract patterns where governance is required.
- Gas costs scale with issuance volume; batching strategies and layer-2 networks can reduce cost.
- Future work: integrate selective disclosure (verifiable creds, ZK proofs), decentralized storage for attachments, and multi-signer contract governance.

1.12 Organization of the Report

Chapter 2: Database Architecture & Data Models
Chapter 3: Smart Contract Design & Implementation
Chapter 4: Backend API Specification
Chapter 5: Frontend Architecture & Component Design
Chapter 6: Authentication & Authorization System
Chapter 7: Blockchain Integration & Transaction Flow
Chapter 8: Deployment, Monitoring & Operations, Limitations

1.13 Database Schema Summary

Core tables and primary fields (abbreviated):

- Institutions: id (CHAR(36)), name, slug, created_at
- Users: id (CHAR(36)), full_name, email, password_hash, is_super_admin, created_at
- InstitutionMembers: id (CHAR(36)), user_id, institution_id, role, created_at
- Certificates: id (CHAR(36)), issuer_id, institution_id, student_name, student_email, course_name, issue_date (TIMESTAMP), cert_hash (CHAR(64)), is_revoked (BOOLEAN), created_at
- BlockchainTransactions: id (CHAR(36)), certificate_id, tx_hash, block_number, chain, created_at
- VerificationLogs: id (CHAR(36)), certificate_id, verifier_ip, status, reason, created_at
- Subscriptions: id (CHAR(36)), institution_id, plan_name, expires_at, created_at

1.14 Example SQL (Certificates)

CREATE TABLE Certificates (
    id CHAR(36) PRIMARY KEY,
    issuer_id CHAR(36) NOT NULL,
    institution_id CHAR(36) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(320) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    issue_date TIMESTAMP NOT NULL,
    cert_hash CHAR(64) NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (issuer_id),
    INDEX (institution_id),
    UNIQUE (cert_hash)
);

CREATE TABLE BlockchainTransactions (
    id CHAR(36) PRIMARY KEY,
    certificate_id CHAR(36) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    chain VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certificate_id) REFERENCES Certificates(id) ON DELETE CASCADE
);

1.15 API Examples

Issue Certificate
POST /api/certificates/issue
Headers: Content-Type: application/json, Authorization: Bearer <JWT>
Body:
{
  "studentEmail": "alice@example.edu",
  "studentName": "Alice Example",
  "courseName": "BSc Computer Science",
  "issueDate": "2026-04-12T10:00:00Z"
}

Successful response (201 Created):
{
  "id": "<uuid>",
  "certHash": "<64-hex-hash>",
  "txHash": "0x...",
  "blockNumber": 12345,
  "qrUrl": "https://frontend.example.com/verify/<id>"
}

Verify Certificate (public)
GET /api/certificates/verify/<certificateId>

Example responses:

SUCCESS
{
  "status": "SUCCESS",
  "certificate": {
    "id": "<uuid>",
    "studentName": "Alice Example",
    "studentEmail": "alice@example.edu",
    "courseName": "BSc Computer Science",
    "issueDate": "2026-04-12T10:00:00Z",
    "certHash": "<64-hex-hash>"
  },
  "onChain": { "valid": true, "institutionId": "<id>", "timestamp": 168... },
  "blockchain": { "txHash": "0x...", "blockNumber": 12345 }
}

TAMPERED
{
  "status": "TAMPERED",
  "message": "Recomputed hash does not match stored hash."
}

INVALID
{
  "status": "INVALID",
  "message": "Certificate not found."
}

REVOKED
{
  "status": "REVOKED",
  "message": "Certificate marked as revoked on-chain.",
  "onChain": { "valid": false }
}

cURL example (verify):
curl -X GET "https://api.example.com/api/certificates/verify/<certificateId>" -H "Accept: application/json"

1.16 Hash Function Example (Node.js)

const crypto = require('crypto');
function generateCertHash(email, name, course, issueDate) {
  const e = email.trim().toLowerCase();
  const n = name.trim();
  const c = course.trim();
  const t = Math.floor(new Date(issueDate).getTime() / 1000);
  const raw = e + '|' + n + '|' + c + '|' + t;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

1.17 QR and Verification Link Format

Each issued certificate includes a QR code that encodes the public verification URL:
https://<FRONTEND_URL>/verify/<certificateId>

Scanning the QR opens the verification page which calls the public API to produce the verification result.

1.18 Recommended Environment Variables

CONTRACT_ADDRESS, OWNER_PRIVATE_KEY, BLOCKCHAIN_WSS, FRONTEND_URL, JWT_SECRET, DATABASE_URL (or DB_HOST/DB_NAME/DB_USER/DB_PASS)

1.19 Notes on Testing

- When NODE_ENV=test the backend exports mock contract objects and skips real blockchain writes. Unit tests should assert hash reproducibility and DB persistence; integration tests may run against a local Hardhat node on port 8546.

Document Version: 1.4
Last Updated: April 12, 2026
