-- 1. Institutions
CREATE TABLE IF NOT EXISTS Institutions (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'INSTITUTION_ADMIN', 'INSTITUTION_STAFF', 'SUPER_ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Institution Members (RBAC)
CREATE TABLE IF NOT EXISTS InstitutionMembers (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    institution_id CHAR(36) NOT NULL,
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (user_id, institution_id)
);

-- 4. Certificates
CREATE TABLE IF NOT EXISTS Certificates (
    id CHAR(36) PRIMARY KEY,
    institution_id CHAR(36) NOT NULL,
    issuer_id CHAR(36) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    cert_hash VARCHAR(255) UNIQUE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revocation_reason TEXT,
    revoked_at TIMESTAMP NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (issuer_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. Blockchain Transactions
CREATE TABLE IF NOT EXISTS BlockchainTransactions (
    id CHAR(36) PRIMARY KEY,
    certificate_id CHAR(36) NOT NULL,
    tx_hash VARCHAR(255) UNIQUE NOT NULL,
    network VARCHAR(50) DEFAULT 'Hardhat',
    block_number BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certificate_id) REFERENCES Certificates(id) ON DELETE CASCADE
);

-- 6. Verification Logs (With Scoping)
CREATE TABLE IF NOT EXISTS VerificationLogs (
    id CHAR(36) PRIMARY KEY,
    certificate_id CHAR(36) NOT NULL,
    institution_id CHAR(36), -- Scoping for better audit
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    result ENUM('SUCCESS', 'TAMPERED', 'FAILED') NOT NULL,
    FOREIGN KEY (certificate_id) REFERENCES Certificates(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE
);

-- 7. Subscriptions (SaaS Tier Management)
CREATE TABLE IF NOT EXISTS Subscriptions (
    id CHAR(36) PRIMARY KEY,
    institution_id CHAR(36) NOT NULL,
    plan_name ENUM('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE') DEFAULT 'TRIAL',
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    UNIQUE KEY (institution_id)
);
