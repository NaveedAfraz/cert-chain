# CertChain — Complete Technical Context Reference

> **Purpose:** This file is a full-fidelity technical reference of the CertChain codebase. Use it to author a 90-page project report. Every fact here is extracted directly from the actual source code.

---

## 1. PROJECT OVERVIEW

**CertChain** is a multi-tenant SaaS platform for issuing, managing, and publicly verifying academic and professional credentials anchored on a blockchain. It was built to solve the global credential fraud problem by bridging institutional relational databases with Web3 immutability.

- **Type:** Full-Stack Blockchain SaaS (Web3 + REST + React)
- **Target Users:** Colleges, Universities, EdTech companies, and their students/graduates
- **Core Value Proposition:** Institutions issue certificates; a SHA-256 hash of each certificate is permanently written to an Ethereum-compatible smart contract. Anyone can publicly verify any certificate without needing institutional access.
- **Architecture Style:** Three-tier (Frontend SPA → REST API Backend → Blockchain Node + MySQL DB)

---

## 2. MONOREPO STRUCTURE

```
CertChain/
├── backend/                   # Node.js / Express REST API
│   ├── src/
│   │   ├── config/            # DB pool + ABI config
│   │   ├── controllers/       # Business logic (auth, certs, institutions)
│   │   ├── middleware/        # JWT auth + subscription guard
│   │   ├── models/            # DB query wrappers (thin data-access layer)
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # Blockchain (ethers.js) service
│   │   └── utils/             # SHA-256 hashing utility
│   ├── tests/                 # Jest integration tests (3 suites)
│   ├── schema.sql             # Full MySQL DDL for all 7 tables
│   ├── init_db.js             # DB initializer script
│   ├── seed_saas.js           # Demo data seeder
│   ├── re-anchor.js           # Re-anchor all certs to new contract
│   ├── reset-pass.js          # Utility: bulk password reset
│   ├── jest.config.js         # Jest config
│   └── package.json
│
├── frontend/                  # React 19 + TypeScript + Vite 8 SPA
│   ├── src/
│   │   ├── components/        # Navbar, Footer
│   │   ├── context/           # AuthContext (React Context + localStorage)
│   │   ├── pages/             # 13 route-level page components
│   │   └── services/          # Axios instance (api.ts)
│   ├── e2e/                   # Playwright E2E tests
│   ├── vercel.json            # SPA rewrite rule for Vercel
│   ├── vite.config.ts         # Vite + Tailwind + React Compiler
│   └── package.json
│
├── blockchain/                # Hardhat project (Solidity smart contract)
│   ├── contracts/
│   │   └── CertificateStore.sol   # The smart contract
│   ├── scripts/
│   │   └── deploy.js              # Deployment script
│   ├── test/
│   │   └── CertificateStore.js    # Hardhat/Chai tests
│   └── hardhat.config.js          # Network config (localhost + Polygon Amoy)
│
├── start.ps1                  # One-click PowerShell dev launcher
└── .gitignore
```

---

## 3. TECH STACK — COMPLETE BREAKDOWN

### 3.1 Backend

| Technology | Version | Role |
|---|---|---|
| Node.js | Runtime (LTS) | Server runtime |
| Express.js | ^5.2.1 | HTTP framework |
| mysql2 | ^3.22.0 | MySQL driver (promise pool) |
| ethers.js | ^6.16.0 | Blockchain interaction (Ethers v6) |
| jsonwebtoken | ^9.0.3 | JWT token signing/verification |
| bcrypt | ^6.0.0 | Password hashing (10 salt rounds) |
| uuid | ^13.0.0 | UUID v4 generation for all PKs |
| qrcode | ^1.5.4 | QR code generation (data URL) |
| dotenv | ^17.4.1 | Environment variable loading |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| Jest | ^30.3.0 | Backend unit/integration testing |
| Supertest | ^7.2.2 | HTTP assertion for tests |
| Nodemon | ^3.1.14 | Dev auto-restart |
| cross-env | ^10.1.0 | Cross-platform env vars for tests |

### 3.2 Frontend

| Technology | Version | Role |
|---|---|---|
| React | ^19.2.4 | UI library |
| TypeScript | ~6.0.2 | Type safety |
| Vite | ^8.0.4 | Build tool / dev server |
| TailwindCSS | ^4.2.2 | Utility-first CSS (via Vite plugin) |
| React Router DOM | ^7.14.0 | Client-side routing |
| Axios | ^1.15.0 | HTTP client |
| Framer Motion | ^12.38.0 | Animations & transitions |
| lucide-react | ^1.8.0 | Icon library |
| react-hot-toast | ^2.6.0 | Toast notifications |
| jsPDF | ^4.2.1 | PDF generation from HTML |
| html-to-image | ^1.11.13 | HTML node → PNG (for PDF export) |
| @fontsource/outfit | ^5.2.8 | Outfit font (self-hosted) |
| Playwright | ^1.59.1 | E2E browser testing |

### 3.3 Blockchain / Smart Contract

| Technology | Version | Role |
|---|---|---|
| Solidity | ^0.8.20 | Smart contract language |
| Hardhat | ^2.22.0 | Development framework |
| hardhat-ethers | ^3.0.0 | Ethers.js integration plugin |
| hardhat-toolbox | ^6.1.2 | Full Hardhat toolbox |
| hardhat-ignition | ^3.1.1 | Deployment module system |
| Chai | (included) | Contract assertion library |
| dotenv | ^17.4.1 | Load backend .env for keys |

### 3.4 Database

- **Engine:** MySQL (compatible with PlanetScale / Aiven Cloud MySQL)
- **Driver:** mysql2 with Promise Pool (connection limit: 10)
- **Test DB:** Automatically switches to `CertChain_test` DB when `NODE_ENV=test`

---

## 4. DATABASE SCHEMA — ALL 7 TABLES

### 4.1 `Institutions`
```sql
CREATE TABLE IF NOT EXISTS Institutions (
    id CHAR(36) PRIMARY KEY,          -- UUID
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 `Users`
```sql
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 `InstitutionMembers` (RBAC bridge table)
```sql
CREATE TABLE IF NOT EXISTS InstitutionMembers (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    institution_id CHAR(36) NOT NULL,
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (user_id, institution_id)
);
```

### 4.4 `Certificates`
```sql
CREATE TABLE IF NOT EXISTS Certificates (
    id CHAR(36) PRIMARY KEY,
    institution_id CHAR(36) NOT NULL,
    issuer_id CHAR(36) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    cert_hash VARCHAR(255) UNIQUE NOT NULL, -- SHA-256 fingerprint
    is_revoked BOOLEAN DEFAULT FALSE,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (issuer_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

### 4.5 `BlockchainTransactions`
```sql
CREATE TABLE IF NOT EXISTS BlockchainTransactions (
    id CHAR(36) PRIMARY KEY,
    certificate_id CHAR(36) NOT NULL,
    tx_hash VARCHAR(255) UNIQUE NOT NULL,    -- on-chain transaction hash
    network VARCHAR(50) DEFAULT 'Hardhat',
    block_number BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certificate_id) REFERENCES Certificates(id) ON DELETE CASCADE
);
```

### 4.6 `VerificationLogs`
```sql
CREATE TABLE IF NOT EXISTS VerificationLogs (
    id CHAR(36) PRIMARY KEY,
    certificate_id CHAR(36) NOT NULL,
    institution_id CHAR(36),               -- for scoped analytics
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    result ENUM('SUCCESS', 'TAMPERED', 'FAILED') NOT NULL,
    FOREIGN KEY (certificate_id) REFERENCES Certificates(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE
);
```

### 4.7 `Subscriptions` (SaaS Tier Management)
```sql
CREATE TABLE IF NOT EXISTS Subscriptions (
    id CHAR(36) PRIMARY KEY,
    institution_id CHAR(36) NOT NULL,
    plan_name ENUM('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE') DEFAULT 'TRIAL',
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (institution_id) REFERENCES Institutions(id) ON DELETE CASCADE,
    UNIQUE KEY (institution_id)
);
```

---

## 5. SMART CONTRACT — `CertificateStore.sol`

**File:** `blockchain/contracts/CertificateStore.sol`  
**Language:** Solidity `^0.8.20`  
**License:** MIT

### 5.1 State Variables
```solidity
address public owner;
mapping(string => CertificateRecord) private certificates;
```

### 5.2 Structs
```solidity
struct CertificateRecord {
    string institutionId;   // UUID of the issuing institution
    uint256 timestamp;      // block.timestamp at issuance
    bool isValid;           // false = revoked
}
```

### 5.3 Events
```solidity
event CertificateIssued(string indexed certHash, string institutionId, uint256 timestamp);
event CertificateRevoked(string indexed certHash, uint256 timestamp);
```

### 5.4 Modifiers
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Caller is not the owner");
    _;
}
```

### 5.5 Functions

**`issueCertificate(string _certHash, string _institutionId)`**
- Access: `onlyOwner`
- Rejects if `_certHash` already exists (`timestamp != 0`)
- Stores `CertificateRecord` and emits `CertificateIssued`

**`verifyCertificate(string _certHash)`**
- Access: `public view` (anyone can call, no gas)
- Returns: `(bool valid, string institutionId, uint256 timestamp)`
- `valid = isValid && timestamp != 0`

**`revokeCertificate(string _certHash)`**
- Access: `onlyOwner`
- Sets `isValid = false` and emits `CertificateRevoked`

### 5.6 ABI (as exposed to backend)
```javascript
const CERTIFICATE_STORE_ABI = [
  "function owner() public view returns (address)",
  "function issueCertificate(string memory _certHash, string memory _institutionId) public",
  "function verifyCertificate(string memory _certHash) public view returns (bool valid, string memory institutionId, uint256 timestamp)",
  "function revokeCertificate(string memory _certHash) public",
  "event CertificateIssued(string indexed certHash, string institutionId, uint256 timestamp)",
  "event CertificateRevoked(string indexed certHash, uint256 timestamp)"
];
```

### 5.7 Network Configuration (`hardhat.config.js`)
```javascript
networks: {
  localhost:    { url: "http://127.0.0.1:8546" },
  polygonAmoy:  { url: process.env.ALCHEMY_AMOY_URL, accounts: [process.env.OWNER_PRIVATE_KEY] }
}
```
- **Solidity version:** `0.8.20`
- **Local port:** `8546` (not the Hardhat default 8545 — intentional to avoid conflicts)
- **Production target:** Polygon Amoy Testnet (via Alchemy RPC URL)

---

## 6. BACKEND — COMPLETE API REFERENCE

### 6.1 Server Entry (`src/index.js`)
- Framework: Express 5
- Middleware: `cors()`, `express.json()`
- Routes mounted at:
  - `/api/auth` → authRoutes
  - `/api/certificates` → certRoutes
  - `/api/institutions` → institutionRoutes
- Health check: `GET /api/health` → `{ status: 'OK', timestamp }`
- Port: `process.env.PORT || 5000` (dev env uses `5001`)

### 6.2 Authentication Routes (`/api/auth`)

| Method | Path | Controller | Auth? | Description |
|---|---|---|---|---|
| POST | `/api/auth/signup-institution` | `signupInstitution` | No | Register institution + admin user |
| POST | `/api/auth/register` | `register` | No | Register standalone user (no institution) |
| POST | `/api/auth/login` | `login` | No | Login → returns JWT |

### 6.3 Certificate Routes (`/api/certificates`)

| Method | Path | Controller | Auth | Description |
|---|---|---|---|---|
| POST | `/api/certificates/issue` | `issueCertificate` | authMiddleware + adminMiddleware + checkSubscriptionLimit | Issue new cert |
| GET | `/api/certificates/my` | `getInstitutionCertificates` | authMiddleware + adminMiddleware | List all certs for current institution |
| GET | `/api/certificates/details/:id` | `getCertificateDetails` | authMiddleware + adminMiddleware | Get single cert + QR code |
| POST | `/api/certificates/revoke/:id` | `revokeCertificate` | authMiddleware + adminMiddleware | Revoke cert on-chain + DB |
| GET | `/api/certificates/verify/:certificateId` | `verifyCertificate` | **None** (public) | Public verification endpoint |

### 6.4 Institution Routes (`/api/institutions`)

| Method | Path | Controller | Auth | Description |
|---|---|---|---|---|
| POST | `/api/institutions` | `addInstitution` | authMiddleware + superAdminMiddleware | Onboard new institution |
| GET | `/api/institutions` | `getInstitutions` | authMiddleware + superAdminMiddleware | List all institutions |
| GET | `/api/institutions/stats` | `getInstitutionStats` | authMiddleware + adminMiddleware | Institution-level analytics |
| GET | `/api/institutions/global-stats` | `getGlobalStats` | authMiddleware + superAdminMiddleware | Platform-wide analytics |

---

## 7. BACKEND — DETAILED CONTROLLER LOGIC

### 7.1 `signupInstitution` Flow
1. Validate all 4 fields: `institutionName`, `fullName`, `email`, `password`
2. Check `email` uniqueness in `Users` table
3. Create `Institution` with UUID and auto-generated slug: `institutionName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')`
4. Create `User` with bcrypt-hashed password (10 rounds)
5. Create `Subscription` with `plan_name = 'TRIAL'`, `expires_at = now + 30 days`
6. Create `InstitutionMember` with `role = 'ADMIN'`
7. Generate JWT with payload: `{ id, isSuperAdmin, name, email, institutionId, role }`
8. Return `{ token, user }` for auto-login

### 7.2 `login` Flow
1. Fetch user by email
2. Compare password against `password_hash` using `bcrypt.compare`
3. Fetch memberships via `getMembershipsByUserId`
4. Determine role: `firstMembership.role` OR `'SUPER_ADMIN'` if `is_super_admin` OR `'USER'`
5. Sign JWT (`expiresIn: '1d'`)
6. Return `{ token, user }` with full user object including `institutionId`, `institutionName`

### 7.3 `issueCertificate` Flow (critical)
1. Extract `issuerId` and `institutionId` from `req.user` (JWT payload)
2. Validate `studentEmail`, `studentName`, `courseName` present
3. Trim all inputs for hash stability
4. Generate `issueDate = new Date(Math.floor(Date.now() / 1000) * 1000)` — floored to second to eliminate millisecond rounding
5. Call `generateCertHash(sEmail, sName, cName, issueDate)` → SHA-256 hex string
6. Write to blockchain: `certificateStoreContract.issueCertificate(certHash, institutionId)`
7. Wait for transaction receipt: `tx.wait()`
8. Insert `Certificates` row with `certHash`, `issueDate`
9. Insert `BlockchainTransactions` row with `tx_hash`, `block_number`
10. Generate QR code data URL pointing to `/verify/${certId}` using `FRONTEND_URL` env variable
11. Return full certificate object + QR code

### 7.4 `verifyCertificate` Flow (public)
1. Fetch certificate from DB with institution join and blockchain transaction join
2. If not found → return `{ status: 'INVALID' }`
3. If `is_revoked = true` → return `{ status: 'REVOKED', data: cert }`
4. **Recalculate hash** from stored DB fields using same `generateCertHash()` function
5. Compare recalculated hash against stored `cert_hash`
6. If mismatch → log `'TAMPERED'`, return `{ status: 'TAMPERED' }`
7. Call blockchain `verifyCertificate(certHash)` with a 10-second timeout guard
8. If `isValidOnChain = true` → log `'SUCCESS'`, return full cert + blockchain metadata
9. If `isValidOnChain = false` → log `'FAILED'`, return `{ status: 'FAILED' }`

### 7.5 `revokeCertificate` Flow
1. Fetch `cert_hash` from Certificates where `id = ?` AND `institution_id = ?` (ownership check)
2. Call `certificateStoreContract.revokeCertificate(certHash)` on-chain
3. Wait for receipt
4. Update DB: `UPDATE Certificates SET is_revoked = TRUE WHERE id = ?`

### 7.6 Institution Analytics (`getInstitutionStats`)
Returns per-institution dashboard data:
- `totalCertificates` — COUNT from Certificates
- `totalVerifications` — COUNT from VerificationLogs (joined through Certificates)
- `subscription` — `plan_name` + `expires_at` from Subscriptions
- `institutionName` — from Institutions

### 7.7 Global Analytics (`getGlobalStats`) — Super Admin only
- `totalInstitutions` — COUNT(*)
- `totalCertificates` — COUNT(*)
- `verificationStats` — total, success, tampered counts from VerificationLogs
- `topInstitutions` — Top 5 institutions by certificate count

---

## 8. CRYPTOGRAPHIC HASHING — `hash.js`

**File:** `backend/src/utils/hash.js`

```javascript
function generateCertHash(studentEmail, studentName, courseName, issueDate) {
    const email = studentEmail.trim().toLowerCase();
    const name = studentName.trim();
    const course = courseName.trim();
    // Normalize to seconds-precision UTC timestamp to eliminate millisecond jitter
    const normalizedTime = Math.floor(new Date(issueDate).getTime() / 1000) * 1000;
    const rawData = `${email}|${name}|${course}|${normalizedTime}`;
    return crypto.createHash('sha256').update(rawData).digest('hex');
}
```

**Key design decisions:**
- Email is always lowercased → prevents case-sensitivity mismatch
- All fields are trimmed → prevents whitespace difference
- Date is normalized to seconds (not milliseconds) to match DB `TIMESTAMP` precision
- Format: `email|name|course|timestampMs` with pipe delimiter
- Algorithm: SHA-256 (Node.js native `crypto` module)
- Output: 64-character hex string

---

## 9. BLOCKCHAIN SERVICE — `blockchain.js`

**File:** `backend/src/services/blockchain.js`

- Reads `BLOCKCHAIN_WSS` env var — supports both WS (`wss://`) and HTTP (`http://`) providers
- Creates `ethers.WebSocketProvider` or `ethers.JsonRpcProvider` based on URL prefix
- Creates `ethers.Wallet` from `OWNER_PRIVATE_KEY` env var (the deployer key)
- Creates `ethers.Contract` instance with the ABI and `CONTRACT_ADDRESS` env var
- **Test mock:** When `NODE_ENV=test`, exports dummy contract objects with fake tx hashes — blockchain not used during tests

---

## 10. MIDDLEWARE REFERENCE

### 10.1 `authMiddleware`
```javascript
const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // { id, isSuperAdmin, name, email, institutionId, role }
```

### 10.2 `adminMiddleware`
```javascript
// Passes if role === 'ADMIN' OR isSuperAdmin === true
if (req.user && (req.user.role === 'ADMIN' || req.user.isSuperAdmin))
```

### 10.3 `superAdminMiddleware`
```javascript
// Passes only if isSuperAdmin === true
if (req.user && req.user.isSuperAdmin)
```

### 10.4 `checkSubscriptionLimit`
Middleware that runs **before** `issueCertificate`:
1. Query `Subscriptions` for `institution_id` from JWT
2. Check `expires_at` — reject if expired
3. For `TRIAL` plan: limit = **100** certificates
4. For `BASIC` plan: limit = **500** certificates
5. For `PRO` / `ENTERPRISE`: unlimited (no count check)
6. Returns HTTP 403 with `{ limitReached: true }` if over limit

---

## 11. DATA MODELS (Thin Query-Wrapper Layer)

### `userModel.js`
- `createUser(id, fullName, email, passwordHash, isSuperAdmin)`
- `getUserByEmail(email)` → returns full row or `undefined`
- `getUserById(id)` → returns full row or `undefined`

### `institutionModel.js`
- `createInstitution(id, name, slug, logoUrl = null)`
- `getAllInstitutions()` → ordered by `created_at DESC`
- `getInstitutionById(id)`
- `getInstitutionBySlug(slug)`

### `membershipModel.js`
- `addMember(id, userId, institutionId, role = 'STAFF')`
- `getMembershipsByUserId(userId)` → joins `Institutions` to include `institution_name`, `institution_slug`
- `getMembersByInstitutionId(institutionId)` → joins `Users` for `full_name`, `email`

### `subscriptionModel.js`
- `createSubscription(id, institutionId, planName = 'TRIAL', expiresAt)`
- `getSubscriptionByInstitutionId(institutionId)`

---

## 12. ENVIRONMENT VARIABLES

### Backend (`.env`)
```
PORT=5001
DB_HOST=<mysql host>
DB_PORT=3306
DB_USER=<mysql user>
DB_PASSWORD=<mysql password>
DB_NAME=CertChain
JWT_SECRET=<secret string>
BLOCKCHAIN_WSS=http://127.0.0.1:8546
OWNER_PRIVATE_KEY=<deployer wallet private key>
CONTRACT_ADDRESS=<deployed contract address>
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5001/api
```

- Production: `VITE_API_URL` is set to the Render.com backend URL
- Accessed in code via `import.meta.env.VITE_API_URL`

### Blockchain (`hardhat.config.js`)
- Reads from `../backend/.env` using `dotenv`
- Requires `OWNER_PRIVATE_KEY` and `ALCHEMY_AMOY_URL` for Polygon Amoy deployment

---

## 13. FRONTEND — ROUTING & PAGES

### 13.1 Route Map (`App.tsx`)

| Path | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/about` | `About` | Public |
| `/verify` | `PublicVerify` | Public |
| `/verify/:certificateId` | `PublicVerify` | Public (deep-link) |
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/pricing` | `Pricing` | Public |
| `/admin/dashboard` | `AdminDashboard` | Institution Admin |
| `/admin/issue` | `IssueCertificate` | Institution Admin |
| `/admin/certificates` | `CertificateList` | Institution Admin |
| `/admin/certificates/:id` | `CertificateDetails` | Institution Admin |
| `/admin/settings` | `Settings` | Institution Admin |
| `/super-admin/dashboard` | `SuperAdminDashboard` | Super Admin |
| `/student/dashboard` | `StudentDashboard` | Student |

**Router:** React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`)

### 13.2 Navigation Logic (Role-Based)
The `Navbar.tsx` dynamically renders links based on auth state:
- **Unauthenticated:** Home, Public Verifier, SaaS Pricing + Log In + Start Free Trial buttons
- **Institution Admin:** Overview, Issue Cert, Records, Portal Settings + logout
- **Super Admin:** Platform Central + logout
- On login (`Login.tsx`): redirects based on `user.role`:
  - `'ADMIN'` → `/admin/dashboard`
  - `isSuperAdmin` → `/super-admin/dashboard`
  - default → `/student/dashboard`

---

## 14. FRONTEND — PAGE-BY-PAGE DESCRIPTION

### 14.1 `Home.tsx`
- Hero section with animated gradient, "Mainnet Active" badge (with ping animation)
- **H1:** "The Standard for Immutable Truth"
- Feature section: 3 cards (Zero Fraud, Decentralized Proof, Privacy First)
- Embedded `<PublicVerify isEmbedded={true} />` in verify section at bottom
- Uses Framer Motion for entrance animations

### 14.2 `PublicVerify.tsx`
- Props: `isEmbedded?: boolean` (controls heading display)
- State: `certId`, `loading`, `result`
- Smart input: strips full `/verify/<id>` URLs to extract raw UUID
- Calls: `GET /api/certificates/verify/${sanitizedId}`
- **4 result states:** SUCCESS (green), REVOKED (yellow), TAMPERED / FAILED / INVALID (red)
- On SUCCESS: shows institution name, student name, course, issue date, cert ID, tx hash

### 14.3 `Login.tsx`
- Fields: email, password
- Calls: `POST /api/auth/login`
- Auto-redirects based on role
- Includes a "Quick Access Demo" panel with hardcoded demo credentials

### 14.4 `Signup.tsx`
- Fields: institutionName, fullName, email, password
- Calls: `POST /api/auth/signup-institution`
- On success: auto-logs-in via `AuthContext.login()`, redirects to `/admin/dashboard`

### 14.5 `AdminDashboard.tsx`
- Calls: `GET /api/institutions/stats` on mount
- Displays 3 stat cards: Total Issued, Public Verifications, SaaS Plan
- Animated bar chart (static demo data: Jan–Dec)
- EVM Network Identity panel (shows ledger sync status, contract version)
- Subscription Health card showing days remaining

### 14.6 `SuperAdminDashboard.tsx`
- Calls both `GET /api/institutions/global-stats` and `GET /api/institutions` in parallel
- 4 stat cards: Active Tenants, Global Certs, Verifications, Success Rate
- Institution list with name + slug + status
- Top Issuers leaderboard (from `topInstitutions` in global stats)
- Integrity Health panel (genuine vs tampered bar with live percentages)
- **Onboard Modal:** animated modal with name + slug inputs → calls `POST /api/institutions`

### 14.7 `IssueCertificate.tsx`
3-stage animated issuance UX:
- **IDLE state:** Form (student name, email, course)
- **Progress state** (HASHING → BLOCKCHAIN → FINALIZING): Animated progress bar + 3 step cards
  - `HASHING` (25%): "Creating non-repudiable identity..."
  - `BLOCKCHAIN` (60%): "Securing consensus on the chain..."
  - `FINALIZING` (90%): "Linking transaction to SQL record..."
- **SUCCESS state:** Certificate UUID, block number, QR code image, "Copy Link" button
- Calls: `POST /api/certificates/issue`

### 14.8 `CertificateList.tsx`
- Title: "Governance Vault"
- Search by student name OR email (client-side filter)
- Filter buttons: All Records / Active / Revoked
- Table columns: Graduate Details (avatar + name + email), Program, Secured Date + tx_hash preview, Status badge
- Row hover reveals action buttons: Copy ID, View details, Download QR
- Calls: `GET /api/certificates/my`

### 14.9 `CertificateDetails.tsx`
- Fetches: `GET /api/certificates/details/:id`
- Shows: student name, email, course, issue date, status badge
- On-chain Audit Trail section: tx_hash, block_number, cert_hash (all monospaced)
- Sidebar: QR code, verification URL, Download PDF button, Share button, Danger Zone (revoke)
- **PDF Export:** Uses `html-to-image` (`toPng`) + `jsPDF` in landscape A4
  - Renders a fully styled off-screen certificate div `1123×794px`
  - Certificate contains: student name in italic serif 72px, course name, institution name, issue date, QR code, cert_hash, institution authority block
- **Share:** Uses Web Share API if available, else clipboard copy
- **Revoke:** Calls `POST /api/certificates/revoke/:id` after `window.confirm`

### 14.10 `Pricing.tsx`
3-tier pricing cards:
- **Basic Trial:** Free — 10 Certs, Public Verification, SHA-256, 30-day trial
- **Professional:** $499/mo — Unlimited Certs, Custom Portal, API Access, Priority Ledger Sync, Analytics
- **Enterprise:** Custom — White-label URL, Private EVM Network, SLA, Dedicated Node

### 14.11 `Settings.tsx`
5-tab sidebar layout: General Profile | Branding | API & Ledger | Billing | User Management
- Only "General Profile" tab is functional (institution name + readonly slug + admin email)
- Other tabs show "Module Coming Soon" placeholder
- Calls `GET /api/institutions/stats` to pre-fill institution name

### 14.12 `StudentDashboard.tsx`
- Hero banner with gradient (brand-600 → indigo-700)
- "My Credential History" section — shows empty state if no certs linked to user email
- Trust Network sidebar (shows "Verified Identity" and "Blockchain Sync" indicators)

### 14.13 `About.tsx`
- Explains the SHA-256 hashing architecture and Web3 immutability concept
- Technical Stack section: Smart Contracts (Solidity/Hardhat) and RESTful Relayer (Node.js/Ethers.js)

---

## 15. FRONTEND — DESIGN SYSTEM

### 15.1 Typography
- **Font:** Outfit (from `@fontsource/outfit`)
- Set as `--font-sans` in Tailwind `@theme`
- Applied globally via `@layer base { body { @apply font-sans antialiased; } }`

### 15.2 Color Palette (Custom Brand Tokens)
```
brand-50:  #f0fdfa    brand-100: #ccfbf1    brand-200: #99f6e4
brand-300: #5eead4    brand-400: #2dd4bf    brand-500: #14b8a6
brand-600: #0d9488    brand-700: #0f766e    brand-800: #115e59
brand-900: #134e4a

dark-800: #111827     dark-900: #030712
```
Brand color family is teal/cyan-based. Secondary accents: indigo, emerald, rose.

### 15.3 Utility Classes (custom)
```css
.glass      { bg-white/70 backdrop-blur-md border border-white/20 }
.glass-dark { bg-dark-900/60 backdrop-blur-xl border border-white/10 }
.text-gradient { bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-600 }
```

### 15.4 Build Configuration (`vite.config.ts`)
```typescript
plugins: [
  tailwindcss(),    // TailwindCSS v4 Vite plugin
  react(),          // @vitejs/plugin-react
  babel({ presets: [reactCompilerPreset()] })  // React 19 Compiler
]
```

### 15.5 TypeScript Config (`tsconfig.app.json`)
- Target: `es2023`
- Module: `esnext` / bundler resolution
- JSX: `react-jsx`
- `noUnusedLocals: false`, `noUnusedParameters: false` (relaxed for development)

---

## 16. AUTHENTICATION CONTEXT (`AuthContext.tsx`)

### User Interface (TypeScript)
```typescript
interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'USER';
    isSuperAdmin: boolean;
    institutionId?: string;
    institutionName?: string;
}
```

### Context Provided Values
```typescript
{
    user: User | null,
    token: string | null,
    login: (token: string, user: User) => void,  // saves to localStorage
    logout: () => void,                            // clears localStorage
    isAuthenticated: boolean,                      // !!token
    isAdmin: boolean,           // role === 'ADMIN' || isSuperAdmin
    isSuperAdmin: boolean,      // isSuperAdmin === true
}
```

### Persistence
- `useEffect` on mount: reads `token` and `user` from `localStorage`
- `login()`: writes both to `localStorage` and React state
- `logout()`: removes both from `localStorage` and resets state

---

## 17. API SERVICE (`api.ts`)

```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```
- Single Axios instance used by all pages
- JWT auto-attached from localStorage on every request
- Base URL switches automatically between dev and production via `VITE_API_URL`

---

## 18. DEPLOYMENT CONFIGURATION

### Frontend — Vercel (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- Catches all routes and serves the SPA `index.html`
- Required for React Router client-side routing to work on Vercel

### Backend — Render.com
- Runs `node src/index.js`
- `PORT`, `DB_*`, `JWT_SECRET`, `BLOCKCHAIN_WSS`, `OWNER_PRIVATE_KEY`, `CONTRACT_ADDRESS`, `FRONTEND_URL` all set as Render environment variables
- Default port: from `process.env.PORT` (Render injects this automatically)

### Blockchain — Production Network
- **Network:** Polygon Amoy Testnet
- **RPC Provider:** Alchemy (`ALCHEMY_AMOY_URL`)
- **Account:** `OWNER_PRIVATE_KEY` used to sign all issuance and revocation transactions

---

## 19. DEVELOPMENT WORKFLOW — `start.ps1`

The PowerShell launcher automates the full 5-step local dev sequence:

1. **[0/5] Port Cleanup** — Kills processes on ports 5001, 8546, 5173 using `netstat`
2. **[1/5] Hardhat Node** — Opens new PowerShell window, runs `npx hardhat node --port 8546`, polls for readiness via JSON-RPC `eth_chainId` call (up to 30s)
3. **[2/5] Deploy Contract** — Runs `npx hardhat run scripts/deploy.js --network localhost`, extracts deployed contract address from stdout with regex
4. **[3/5] Update .env** — Replaces `CONTRACT_ADDRESS=` line in `backend/.env` with the new deployed address
5. **[4/5] Re-anchor** — Runs `node re-anchor.js` to replay all existing DB certificates onto the fresh contract
6. **[5/5] Start Backend & Frontend** — Opens two more PowerShell windows (`npm start` and `npm run dev`)

---

## 20. `re-anchor.js` — BLOCKCHAIN STATE MIGRATION

**Purpose:** Each time the Hardhat node restarts, it loses all chain state. This script re-registers all existing DB certificates onto the newly deployed contract.

**Process:**
1. Connect to `BLOCKCHAIN_WSS` with `OWNER_PRIVATE_KEY`
2. Query all non-revoked certificates from DB ordered by `issue_date ASC`
3. For each: call `contract.issueCertificate(cert_hash, institution_id)` with explicit nonce management
4. Handles "already issued" error gracefully (continues without failing)
5. Refreshes nonce from network on failure to recover

---

## 21. TESTING STRATEGY

### 21.1 Backend — Jest Integration Tests

**Config (`jest.config.js`):**
- `testEnvironment: 'node'`
- `setupFilesAfterEnv: ['./tests/setup.js']`
- `testMatch: ['**/tests/**/*.test.js']`
- `forceExit: true`, `clearMocks: true`, `resetMocks: true`, `restoreMocks: true`

**Setup (`tests/setup.js`):**
- Mocks `uuid` to produce deterministic sequential UUIDs
- Provides global `clearDatabase()` helper that truncates all 7 tables (with FK checks disabled)
- Tests use `CertChain_test` database (auto-switched via `NODE_ENV=test` in `db.js`)
- Blockchain is fully mocked — no real contract needed

**Test Suites:**

#### `auth.test.js` — 3 tests
- `POST /api/auth/signup-institution` — creates institution + admin, returns 201 + JWT with `role: 'ADMIN'`
- `POST /api/auth/login` — valid credentials return 200 + JWT
- `GET /api/institutions/stats` — 401 without token, 200 with admin token, has `totalCertificates` field

#### `certificates.test.js` — 3 tests
- `POST /api/certificates/issue` — successful issuance returns 201, blockchain txHash starts with `0x`
- Verification flow — issue then call `GET /verify/:id` → status `'SUCCESS'`
- Plan limit enforcement — inserts 99 dummy records, 102nd insertion returns 403 with `{ limitReached: true, message: "Plan limit reached (100 credentials)" }`

#### `institutions.test.js` — 2 tests
- `GET /api/institutions/stats` — fresh institution returns `totalCertificates: 0`
- RBAC: regular (non-admin) user token returns 403 on stats endpoint

### 21.2 Frontend — Playwright E2E Tests

**Config (`playwright.config.ts`):**
- `testDir: './e2e'`
- Browser: Chromium only (`Desktop Chrome`)
- `baseURL: 'http://localhost:5173'`
- Auto-starts dev server (`npm run dev`) before tests
- 1 worker, HTML reporter

**`onboarding.spec.js` — 1 test**
- Full signup lifecycle: fills form → clicks "Explore Free Trial" → asserts redirect to `/admin/dashboard`
- Logout via `localStorage.clear()` → navigate to `/login` → fill email/password → assert `/admin/dashboard`

**`issuance.spec.js` — 2 tests**
- Certificate issuance: navigates to `/admin/issue`, fills all fields, clicks "Secure on Blockchain", waits for "Block Secured" text and QR code image
- Public verification access: navigates to `/verify`, confirms heading and input visible

---

## 22. SAAS SUBSCRIPTION MODEL

### Plan Tiers

| Plan | Certificate Limit | Expiry | Notes |
|---|---|---|---|
| TRIAL | 100 | 30 days from signup | Auto-assigned on `signupInstitution` |
| BASIC | 500 | Set by admin | Manual upgrade |
| PRO | Unlimited | Set by admin | No count check in middleware |
| ENTERPRISE | Unlimited | Set by admin | Dedicated infrastructure |

### Pricing Page UI Values
- Trial: Free
- Professional: $499/mo — Unlimited Certs, Custom Portal, API Access, Priority Ledger Sync, Advanced Analytics
- Enterprise: Custom pricing — White-label URL, Private EVM, SLA, Dedicated Node

### Enforcement
The `checkSubscriptionLimit` middleware enforces limits at the API level (not just UI) before any issuance can proceed.

---

## 23. RBAC SYSTEM (Role-Based Access Control)

### User Roles
| Role | Source | Permissions |
|---|---|---|
| `USER` | No institution membership | Read-only (future student portal) |
| `STAFF` | InstitutionMembers.role = 'STAFF' | (Future: limited issue access) |
| `ADMIN` | InstitutionMembers.role = 'ADMIN' | Issue, revoke, view all certs for own institution; view institution stats |
| `SUPER_ADMIN` | Users.is_super_admin = true | All admin rights + global stats + institution management |

### JWT Payload
```javascript
{
    id: userId,
    isSuperAdmin: boolean,
    name: fullName,
    email: email,
    institutionId: string | null,
    role: 'ADMIN' | 'STAFF' | 'USER' | 'SUPER_ADMIN'
}
// Signed with JWT_SECRET, expires in 1 day
```

### Seeded Demo Credentials
| Account | Email | Password | Role |
|---|---|---|---|
| Super Admin | admin@certchain.io | admin123 | SUPER_ADMIN |
| College Admin | jane@global.edu | college123 | ADMIN (Global University) |

---

## 24. QR CODE SYSTEM

- **Library:** `qrcode` npm package
- **Generated at:** certificate issuance time AND on `getCertificateDetails` requests
- **URL encoded:** `{FRONTEND_URL}/verify/{certificateId}`
- **Format:** Data URL (base64 PNG) returned in API response as `qrCode` field
- **Uses:**
  - Displayed on IssueCertificate success screen
  - Displayed in CertificateDetails sidebar
  - Printed in the downloadable PDF certificate
  - Available for download from CertificateList row actions

---

## 25. PDF CERTIFICATE GENERATION

**Technical approach:** Off-screen HTML div is rendered in the DOM (positioned at `left: -5000px`), captured as a PNG via `html-to-image (toPng)`, then embedded into a `jsPDF` landscape A4 document.

**Reasons for `html-to-image` over `html2canvas`:**
- `html2canvas` has known parsing errors with Tailwind's `oklch()` CSS colors
- `html-to-image` uses browser-native SVG rendering, bypassing this issue

**Certificate Layout (1123×794px, landscape A4):**
- Outer border: 12px solid `#164e63` (dark cyan)
- Inner border: 2px solid `rgba(22,78,99,0.5)` on light gray background
- Watermark: Award icon, 500px, 3% opacity
- **Title:** "Certificate of Achievement" — 36px, 800 weight, uppercase, letter-spacing 0.3em
- **Student name:** 72px italic serif (Georgia), 900 weight
- **Course name:** 30px serif, 700 weight, `#0e7490`
- **Footer (3 blocks):**
  - Left: QR code (96×96)
  - Center: ShieldCheck icon + "Blockchain Secured" + cert_hash in monospace
  - Right: Signature line + institution_name + "Authorized Signatory" + issue date
- Saved as: `Certificate_{StudentName}.pdf`

---

## 26. KEY TECHNICAL DECISIONS & DESIGN RATIONALE

1. **Only the hash is on-chain, not the certificate data** — Privacy first. Student PII stays in the institutional MySQL database. The blockchain only knows a SHA-256 fingerprint.

2. **Dual-layer verification** — Verification checks BOTH the database integrity (hash recalculation) AND the blockchain state. A certificate that passes DB hash check but fails on-chain is marked `FAILED`, not `SUCCESS`.

3. **Issue date floored to seconds** — `new Date(Math.floor(Date.now() / 1000) * 1000)` — Eliminates millisecond rounding differences between JavaScript's `Date.now()` and MySQL's `TIMESTAMP` type (which stores to second precision).

4. **Blockchain timeout guard** — The verify endpoint wraps the blockchain call in a 10-second `Promise.race` with a timeout, returning `{ status: 'ERROR' }` if the node is unreachable. This prevents frontend from hanging indefinitely.

5. **Verification logging** — Every public verification attempt logs to `VerificationLogs` with `SUCCESS`, `TAMPERED`, or `FAILED`. This enables tamper-detection auditing in the Super Admin dashboard.

6. **Blockchain mock in tests** — `blockchain.js` exports dummy contract objects when `NODE_ENV=test`. This means the 3 Jest test suites run without any blockchain dependency, making CI fast and reliable.

7. **Re-anchoring script** — Since Hardhat's in-memory state is reset on restart, all existing DB certs would lose their on-chain proof. `re-anchor.js` replays all non-revoked certs to the new contract after each restart, maintaining data consistency.

8. **Slug auto-generation** — Institution slugs are auto-generated on signup: `institutionName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')`. Ensures URL-safe unique identifiers.

9. **Multi-tenancy** — Each institution is completely isolated. All certificate queries filter by `institution_id` derived from the JWT. An admin from Institution A cannot see Institution B's certificates.

10. **React Context + localStorage** — No server-side sessions. JWT is stored in `localStorage` and re-hydrated on page load via `useEffect`. Trade-off: simple implementation vs. XSS vulnerability (acceptable for MVP/academic context).

---

## 27. UTILITY SCRIPTS SUMMARY

| Script | Command | Purpose |
|---|---|---|
| `init_db.js` | `node init_db.js` | Drop & recreate all tables from `schema.sql` |
| `seed_saas.js` | `node seed_saas.js` | Insert demo institution + super admin + college admin |
| `re-anchor.js` | `node re-anchor.js` | Re-register all DB certs on new blockchain contract |
| `reset-pass.js` | `node reset-pass.js` | Reset ALL user passwords to `12341234` (dev utility) |
| `start.ps1` | `./start.ps1` | Full local dev launcher (blockchain → deploy → backend → frontend) |

---

## 28. COMPONENT INVENTORY

### Shared Components
| File | Description |
|---|---|
| `Navbar.tsx` | Fixed glassmorphism nav; role-based links; Outfit font; brand-600 logo |
| `Footer.tsx` | Dark (dark-900) footer; 4-column grid; Protocol, Resources, Trust Metrics sections |

### Page Components (13 total)
| File | Route | Size |
|---|---|---|
| `Home.tsx` | `/` | 122 lines |
| `About.tsx` | `/about` | 53 lines |
| `Login.tsx` | `/login` | 116 lines |
| `Signup.tsx` | `/signup` | 132 lines |
| `PublicVerify.tsx` | `/verify/:id` | 141 lines |
| `Pricing.tsx` | `/pricing` | 104 lines |
| `AdminDashboard.tsx` | `/admin/dashboard` | 153 lines |
| `IssueCertificate.tsx` | `/admin/issue` | 294 lines |
| `CertificateList.tsx` | `/admin/certificates` | 208 lines |
| `CertificateDetails.tsx` | `/admin/certificates/:id` | 292 lines |
| `Settings.tsx` | `/admin/settings` | 188 lines |
| `SuperAdminDashboard.tsx` | `/super-admin/dashboard` | 274 lines |
| `StudentDashboard.tsx` | `/student/dashboard` | 123 lines |

---

## 29. VERIFICATION STATUS CODES

| Status | Meaning | HTTP Code | UI Color |
|---|---|---|---|
| `SUCCESS` | Hash matches DB + valid on blockchain | 200 | Green |
| `REVOKED` | Certificate was deliberately revoked | 200 | Yellow |
| `TAMPERED` | DB hash recalculation mismatch | 400 | Red |
| `FAILED` | DB hash OK but blockchain returns invalid | 400 | Red |
| `INVALID` | Certificate ID not found in DB | 404 | Red |
| `ERROR` | Blockchain node unreachable (timeout) | 503 | Red |

---

## 30. FULL DEPENDENCY GRAPH (Key Relationships)

```
Frontend (React SPA)
  └── AuthContext (localStorage JWT)
  └── api.ts (Axios + Bearer token interceptor)
  └── Pages → api.ts → Backend REST API

Backend (Express)
  └── authRoutes → authController → userModel / institutionModel / membershipModel / subscriptionModel
  └── certRoutes → certController → hash.js + blockchain.js + db.js
  └── institutionRoutes → institutionController → db.js
  └── authMiddleware (JWT verify)
  └── subscriptionMiddleware (plan limit check)

blockchain.js (Ethers.js v6)
  └── BLOCKCHAIN_WSS (JsonRpcProvider / WebSocketProvider)
  └── OWNER_PRIVATE_KEY → Wallet
  └── CONTRACT_ADDRESS + ABI → Contract instance

MySQL Database
  └── Institutions → InstitutionMembers → Users
  └── Institutions → Certificates → BlockchainTransactions
  └── Certificates → VerificationLogs
  └── Institutions → Subscriptions

Smart Contract (Solidity 0.8.20)
  └── mapping(string => CertificateRecord) private certificates
  └── onlyOwner modifier (deployer wallet only)
```

---

*End of CertChain Technical Context — All data sourced from actual project files.*
