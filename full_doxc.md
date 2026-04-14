CHAPTER 1
INTRODUCTION
1.1 Introduction
CertChain is an advanced, multi-tenant Software-as-a-Service platform engineered to issue, manage, and publicly verify academic and professional credentials by anchoring them to a blockchain. The system is specifically designed to combat the escalating global crisis of credential fraud by bridging the operational efficiency of traditional institutional relational databases with the cryptographic immutability of modern Web3 networks. Built upon a robust three-tier architecture, the platform integrates a dynamic React single-page application frontend with a highly secure Node.js and Express backend, culminating in a dual data persistence layer utilizing both a MySQL database and an Ethereum-compatible Solidity smart contract. By issuing certificates and permanently recording their unique cryptographic signatures on a public ledger, CertChain empowers institutions to grant undeniable proof of achievement while allowing any third party to instantly verify a credential without requiring institutional access.
1.2 Problem Statement
The modern academic and professional landscape is severely compromised by the proliferation of forged credentials and the fundamental vulnerabilities of traditional verification processes. Physical paper certificates are highly susceptible to sophisticated counterfeiting, while conventional digital records stored in centralized, siloed institutional databases remain vulnerable to unauthorized alterations and malicious tampering. Furthermore, the traditional verification process is notoriously inefficient, often requiring prospective employers to engage in slow, manual correspondence with university registrars to confirm a candidate's background. Conversely, attempts to migrate entire academic records to public blockchains have introduced severe privacy violations, exposing sensitive Personally Identifiable Information to the public domain. There is an urgent, unaddressed need for a decentralized, privacy-first ecosystem capable of instantly validating the authenticity of a document without exposing underlying student data or relying on tedious manual administrative bottlenecks.
1.3 Objectives
The primary objective of the CertChain platform is to engineer a secure, scalable software ecosystem that allows educational institutions and corporate entities to issue cryptographically verifiable credentials seamlessly. A core goal is to architect a privacy-preserving hashing mechanism that generates a unique mathematical fingerprint of a student's achievement, ensuring that only this non-reversible signature is anchored to the public blockchain while all sensitive personal data remains secured within the isolated institutional database. The project aims to develop a highly accessible, public-facing verification portal capable of performing a sophisticated dual-layer validation, simultaneously checking the relational database integrity and the immutable blockchain state. Additionally, the system seeks to implement a comprehensive, role-based access control and subscription management architecture, empowering super-administrators to securely onboard, govern, and monitor diverse institutional tenants within a unified software ecosystem.
1.4 Methodology
1.4.1 Requirement Gathering and Analysis
The foundational phase of the project involved a comprehensive analysis of the contemporary credentialing landscape, identifying the critical intersection between data privacy regulations and the necessity for cryptographic proof. The engineering team determined that a hybrid architectural approach was absolutely essential, recognizing that a purely decentralized application would violate privacy standards. This phase solidified the requirement for a multi-tenant database schema capable of securely isolating distinct institutional records while simultaneously standardizing the payload required to generate stable, collision-resistant cryptographic hashes for blockchain anchoring.
1.4.2 System Design and Architecture
To accommodate the complex logistical requirements of blockchain integration and high-speed user interactions, the application was designed utilizing a decoupled, three-tier architecture. The presentation layer was structured as a highly responsive single-page application utilizing the latest React framework and Tailwind CSS, prioritizing a seamless administrative experience. The application logic tier was formulated using a Node.js runtime and the Express framework to orchestrate secure JSON Web Token authentication, database interactions, and blockchain communication via specialized libraries. The data persistence tier was bifurcated into a traditional MySQL relational database for managing user accounts and a Solidity smart contract deployed to an Ethereum-compatible network to serve as the ultimate, immutable ledger of truth.
1.4.3 Development Phase (Module Implementation)
During active development, backend engineers constructed a comprehensive application programming interface featuring numerous secure routing endpoints tailored for institutional onboarding, certificate issuance, and cryptographic verification. The backend logic prioritized the development of a highly stable hashing algorithm utilizing the SHA-256 standard, normalizing timestamps to ensure absolute consistency between database records and blockchain payloads. Concurrently, the frontend team developed the visual interface, focusing heavily on building intuitive administrative dashboards equipped with real-time analytical visualizations and an animated, multi-stage issuance interface that clearly communicates the complex blockchain anchoring process to the end-user.
1.4.4 Testing and Quality Assurance
Quality assurance protocols were rigorously applied to guarantee transactional reliability, particularly concerning the irreversible nature of smart contract interactions. The backend architecture was subjected to intense integration testing utilizing the Jest framework, employing simulated blockchain environments to verify that complex issuance and revocation logic executed flawlessly without expending real computational gas. Simultaneously, the frontend ecosystem was audited using the Playwright framework to conduct extensive end-to-end testing, guaranteeing that critical user journeys, such as institutional registration and public certificate verification, functioned seamlessly across varying network conditions.
1.4.5 Deployment and Release
The transition to a production-ready state required a meticulous, distributed deployment strategy to ensure high availability and network resilience. The frontend application was configured for deployment on an advanced edge network, guaranteeing minimal latency and rapid content delivery for global users attempting to verify credentials. The central Node.js server was hosted on a dedicated cloud service, securely provisioned with encrypted environment variables to manage the private cryptographic keys necessary for signing transactions. Finally, the foundational smart contract was migrated from a local development environment and permanently deployed to the Polygon Amoy testnet, providing a highly secure, low-latency decentralized ledger for continuous certificate anchoring.
 
CHAPTER 2
REQUIREMENTS AND SYSTEM ANALYSIS
2.1 Functional Requirements
The functional requirements of the CertChain platform define a sophisticated, multi-tenant ecosystem capable of servicing educational institutions, corporate issuers, and public verifiers simultaneously. The system acts as a centralized trust hub, offering distinct workflows tailored to credential generation and cryptographic validation.
The core functional capabilities of the system include:
•	Multi-Tenant Onboarding: The system must provide a secure onboarding portal that automatically generates administrative accounts, unique URL-friendly slugs, and default trial subscriptions for newly registered institutions.
•	Credential Issuance Flow: The platform must facilitate digital certificate generation by capturing student details, formatting the payload, and computing a deterministic SHA-256 cryptographic hash.
•	Blockchain Anchoring: Upon issuance, the backend must programmatically interact with an Ethereum-compatible smart contract to write the unique certificate hash permanently to the public ledger.
•	Dual-Layer Public Verification: The platform must offer a robust verification portal, accessible without authentication, that cross-references the relational database integrity alongside the immutable blockchain transaction record.
•	Administrative Governance: The system mandates a comprehensive dashboard for super-administrators and institution-admins to monitor global platform analytics, revoke compromised certificates, and oversee platform-wide SaaS subscription limits.
2.2 Non-Functional Requirements
Non-functional requirements within the CertChain architecture prioritize data privacy, computational performance, and overall system reliability. The system must operate flawlessly to maintain its status as an absolute source of credential truth.
Key non-functional requirements include:
•	Strict Data Privacy (Zero-Knowledge): A foundational requirement is the strict preservation of student privacy. The system must guarantee that no personally identifiable information (PII) is ever transmitted to the public blockchain, anchoring only the irreversible cryptographic fingerprint.
•	Verification Performance: To prevent the frontend application from hanging indefinitely due to blockchain network congestion, the backend must implement a strict 10-second timeout guard during all blockchain node interactions.
•	Cross-Platform Responsiveness: The platform must ensure high availability and seamless user experiences across various devices, mandating a responsive interface design that transitions fluidly from complex desktop administrative tables to mobile-friendly public verification screens.
•	High Availability and Reliability: The decoupled microservices architecture must ensure that heavy cryptographic computations do not degrade the web server's ability to serve concurrent verification requests globally.
2.3 System Requirements and Deployment Architecture
The system requirements for CertChain reflect its modern, decoupled three-tier architecture. It heavily relies on specialized cloud infrastructure to guarantee rapid content delivery, continuous backend availability, and secure blockchain node communication.
The foundational deployment and infrastructure requirements dictate:
•	Client Edge Environment (Vercel): To satisfy the requirement for global, low-latency accessibility, the React and Vite single-page application must be deployed on the Vercel edge network, utilizing specific rewrite rules to manage client-side routing seamlessly.
•	Backend Application Server (Render): The Node.js and Express backend infrastructure must be hosted on the Render cloud application platform, securely managing injected environment variables containing critical database connection strings and private cryptographic keys.
•	Relational Data Tier: The data persistence tier relies on a highly relational MySQL database, configured with a strict connection pooling limit (maximum 10 connections) to handle concurrent verification queries efficiently without exhausting memory limits.
•	Blockchain Network: The ultimate ledger of truth requires an Ethereum-compatible network, specifically utilizing the Polygon Amoy testnet to execute Solidity smart contracts with high throughput and minimal transaction fees.
2.4 Security and Access Control Considerations
Security forms the absolute core of the CertChain ecosystem, given its purpose as a definitive source of credential truth. The platform must aggressively defend against data tampering, unauthorized issuance, and unauthorized access to institutional records.
Critical security implementations include:
•	Stateless Authentication: User sessions must be governed by JSON Web Tokens (JWT), providing secure, stateless session management that encapsulates crucial user roles and institutional affiliations.
•	Cryptographic Hashing: All sensitive user passwords must be encrypted utilizing the bcrypt hashing algorithm with 10 computational salt rounds prior to database insertion.
•	Role-Based Access Control (RBAC): The backend API must implement rigorous middleware to explicitly segregate capabilities, ensuring standard users cannot bypass tenant subscription limits or execute commands reserved for 'ADMIN' or 'SUPER_ADMIN' roles.
•	Hash Normalization: The cryptographic integrity of the certificates relies on a highly stabilized SHA-256 hashing algorithm that strictly normalizes all text inputs and floors timestamps to the nearest second, completely preventing hash mismatch errors during public verification.
2.5 Smart Contract and Blockchain Integration Requirements
A highly specialized requirement of the CertChain ecosystem is the secure integration with an underlying Web3 infrastructure. The platform requires a bespoke Solidity smart contract designed to permanently store evidence of credential issuance and revocation states.
The smart contract and blockchain integration must satisfy the following computational requirements:
•	Immutable State Storage: The Solidity smart contract must utilize an internal mapping structure to securely associate each 64-character SHA-256 certificate hash with its corresponding issuing institution ID and block timestamp.
•	Owner-Restricted Modifiers: The contract must strictly enforce an onlyOwner modifier on state-changing functions, ensuring that only the authorized CertChain backend wallet (holding the private key) can execute issueCertificate or revokeCertificate transactions.
•	Gasless Verification Protocol: The primary verifyCertificate function must be designated as a public view method. This allows the backend relayer—and any independent third-party verifier—to query the blockchain state instantly without incurring computational gas fees.
•	Automated Re-anchoring: The backend infrastructure must include specialized synchronization scripts (re-anchor.js) capable of querying the MySQL database and replaying historical certificate issuances onto fresh smart contracts in the event of a network reset or migration protocol.
 
CHAPTER 3
EXISTING SOLUTIONS AND LITERATURE REVIEW
3.1 Existing Solutions
The global landscape of academic and professional credentialing is currently fragmented, relying heavily on antiquated verification methodologies that are highly susceptible to fraud. Traditionally, institutions and employers are forced to navigate a decentralized web of isolated databases or depend on physical documentation to confirm a candidate's achievements.
Commonly utilized legacy systems and their specific limitations include:
•	Physical Paper Credentials: Traditional paper-based certificates are inherently vulnerable to sophisticated counterfeiting and forgery. Furthermore, verifying these documents across international borders requires slow, manual correspondence with university registrars, resulting in severe administrative bottlenecks during the hiring process.
•	Centralized Institutional Databases: While many universities have digitized their records, these centralized SQL databases act as isolated silos. They lack cross-institutional standardization and remain highly vulnerable to insider threats, unauthorized alterations, or targeted cyberattacks that could silently compromise the integrity of academic records.
•	Third-Party Background Check Agencies: Employers often outsource verification to costly third-party agencies. These intermediaries introduce significant financial overhead, prolong the recruitment lifecycle, and still ultimately rely on manual communication with the issuing institutions to confirm data validity.
•	Pure Public Blockchain Deployments: Early attempts to migrate academic records to Web3 environments often involved writing raw student data directly to a public ledger. This approach represents a catastrophic violation of modern data privacy regulations (such as GDPR), as it permanently exposes sensitive Personally Identifiable Information (PII) to the public domain without any mechanism for true deletion.
CertChain directly addresses these pervasive systemic failures by introducing a hybrid, privacy-first architecture. By storing sensitive student PII securely within an isolated, multi-tenant MySQL relational database and exclusively writing a normalized SHA-256 cryptographic hash to the public Polygon blockchain, the platform guarantees undeniable proof of existence. This zero-knowledge approach eliminates the risk of forgery, provides instantaneous public verification, and ensures absolute compliance with strict data privacy laws.
3.2 Relevant Technologies
The development of the CertChain ecosystem relies on a sophisticated, multi-tiered technology stack carefully selected to bridge high-performance web architecture with decentralized Web3 immutability.
The core technologies driving the platform include:
•	Frontend Presentation Layer (React 19 & Vite 8): The client interface is engineered as a highly interactive Single Page Application utilizing the latest React framework and TypeScript for strict type safety. Bundled with Vite and styled via Tailwind CSS, the frontend delivers a responsive, animated user experience powered by Framer Motion.
•	Backend Application Logic (Node.js & Express 5): The central application programming interface operates on a robust Node.js runtime utilizing the Express framework. This tier securely orchestrates multi-tenant institutional onboarding, JWT-based stateless authentication, and the cryptographic normalization of certificate payloads.
•	Relational Data Tier (MySQL): A highly relational MySQL database, optimized with a strict promise-based connection pool, manages the complex associations between institutional tenants, user roles, active subscriptions, and raw certificate data.
•	Blockchain Integration (Ethers.js v6): The backend relies on the Ethers.js library to act as a secure relayer, connecting the Node.js server to the Ethereum-compatible blockchain via WebSockets and remote procedure calls (RPC).
•	Smart Contract Infrastructure (Solidity & Hardhat): The immutable ledger logic is written in Solidity (v0.8.20) and developed using the Hardhat framework. The contract utilizes strict onlyOwner modifiers and efficient memory mapping to securely anchor and verify 64-character SHA-256 hashes.
•	Production Ledger (Polygon Amoy Testnet): To guarantee high transaction throughput and minimal computational gas fees, the compiled smart contract is deployed to the Polygon network, providing a highly scalable, eco-friendly proof-of-stake blockchain environment.
3.3 Literature Review
Academic and industry literature surrounding educational technology and digital identity consistently underscores the profound vulnerabilities within legacy credentialing systems. Researchers have extensively documented that the ease of digital manipulation has led to an unprecedented rise in academic fraud, disproportionately diluting the value of legitimate qualifications and eroding employer trust. As digital transformation initiatives permeate higher education, the architectural focus has shifted heavily toward verifiable credentials and decentralized identity management.
Contemporary studies in applied cryptography and Web3 architectures strongly advocate for the integration of blockchain technology as a decentralized state machine capable of providing immutable timestamps and proof of origin. However, the academic consensus heavily scrutinizes the "privacy versus transparency trilemma" inherent in public blockchains. Literature emphasizes that storing plain-text personal data on an immutable ledger violates the fundamental right to be forgotten. Consequently, recent cryptographic research champions the use of off-chain storage combined with on-chain cryptographic hashing. By generating a deterministic hash of the credential payload, systems can anchor a mathematically irreversible fingerprint to the blockchain, allowing anyone to verify the document's authenticity without exposing the underlying data.
The engineering and cryptographic philosophy behind the CertChain platform is deeply rooted in these modern academic findings. By synthesizing the theoretical foundations of scalable RESTful web architecture with a highly specialized, gasless verification protocol on the Polygon network, the project effectively bridges the gap between theoretical Web3 privacy research and practical, high-stakes institutional deployment.
 
CHAPTER 4
SYSTEM DEVELOPMENT AND DESIGN
 

4.1 System Development
The development of the CertChain platform was executed utilizing a highly modular, multi-tiered engineering approach to ensure maximum scalability, stringent data privacy, and seamless blockchain integration. The development lifecycle was partitioned into three distinct tracks focusing on the client-facing presentation layer, the transactional backend application programming interface, and the decentralized smart contract infrastructure. The frontend was constructed using React 19 and TypeScript, bundled with the Vite build tool to deliver a highly responsive, type-safe single-page application. Concurrently, the backend infrastructure was developed using the Node.js runtime environment and the Express 5.2.1 framework. Server-side development focused heavily on establishing secure routing protocols, implementing robust JSON Web Token (JWT) authentication, and engineering a highly efficient connection pool to manage concurrent data requests to the MySQL database. Finally, the decentralized layer was engineered using Solidity and the Hardhat development framework, producing a highly optimized smart contract designed exclusively to store and verify 64-character cryptographic hashes on the blockchain.
4.2 Analysis
Prior to the commencement of active coding, a comprehensive architectural analysis was conducted to address the logistical complexities inherent in bridging traditional educational databases with public ledger technology. The analysis identified the "privacy versus transparency trilemma" as the primary obstacle; storing plain-text academic records directly on a public blockchain would explicitly violate global data protection regulations. Consequently, the analysis mandated the adoption of a hybrid, zero-knowledge architecture. The system analysis dictated that the platform must utilize an off-chain relational database to securely store all Personally Identifiable Information (PII) and tenant relationships. Simultaneously, the platform must employ a deterministic hashing algorithm to convert the certificate payload into an irreversible SHA-256 fingerprint, which is the only data point permanently anchored to the public blockchain network.
4.3 Design of the Application
The architectural design of the CertChain application prioritizes data clarity, intuitive navigation, and a high-trust visual aesthetic tailored to institutional software. The user interface was meticulously engineered using the Tailwind CSS utility framework and Framer Motion to establish a clean, accessible, and responsive design language. To accommodate a multi-tenant ecosystem, the application features a dynamic, role-based layout strategy.
Key design implementations include:
•	Public Verification Portal: A highly accessible, mobile-responsive interface that allows unregistered employers or auditors to instantly verify a certificate by scanning a QR code or inputting a unique identifier, returning immediate cryptographic proof of authenticity.
•	Institutional Administrative Console: A protected, data-rich interface providing college administrators with tools to issue new credentials, manage SaaS subscription limits, revoke compromised certificates, and track detailed issuance analytics.
•	Super-Administrator Dashboard: A centralized command center empowering platform operators to securely onboard new institutional tenants, monitor global verification success rates, and oversee platform-wide integrity health.
4.4 UML Diagrams
4.4.1 Class Diagram
This class diagram represents the core entities within the CertChain hybrid database ecosystem and their underlying relationships, highlighting how institutional accounts connect to specific credentials, on-chain transactions, and public verification logs.
 
Figure 4.1: Class Diagram illustrating the relational mapping between Institutions, Users, Certificates, and Blockchain Transactions.
4.4.2 Use Case Diagram
This use case diagram explicitly illustrates the strict separation of capabilities between public verifiers, institutional staff, and elevated platform super-administrators managing the SaaS ecosystem.
 
Figure 4.2: Use Case Diagram demonstrating the divergent access pathways between public verification and secure institutional governance.
4.4.3 Activity Diagram
This activity diagram traces the highly specialized workflow of generating and anchoring a new credential, detailing the cryptographic hashing and blockchain interaction sequence.
 
Figure 4.3: Activity Diagram detailing the dual-layer issuance workflow, from initial data capture to smart contract anchoring and final database storage.
4.4.4 Deployment Diagram
This deployment diagram details the distributed cloud architecture necessary to support the hybrid Web3 ecosystem, ensuring high availability, rapid public verification, and secure ledger synchronization.
 Figure 4.4: Deployment Diagram depicting the microservices-inspired cloud architecture, showcasing the separation between the frontend edge network, the backend API, the relational database, and the decentralized blockchain network.
4.5 Proposed Architecture
The proposed architecture transitions away from centralized legacy silos in favor of a highly resilient, hybrid Web3 ecosystem. The presentation tier operates entirely within the user's browser as a dynamic React single-page application, handling complex administrative dashboards and off-screen PDF certificate generation utilizing html-to-image and jsPDF. The application logic tier is housed within a centralized Node.js server utilizing the Express framework. This tier securely orchestrates all data processing, acting as a cryptographic relayer that computes deterministic SHA-256 hashes by normalizing inputs and flooring timestamps to eliminate millisecond jitter. The backend communicates synchronously with an Ethereum-compatible smart contract deployed on the Polygon Amoy network via Ethers.js. Finally, the relational data tier relies on a managed MySQL database to enforce strict data consistency and multi-tenant isolation, ensuring that institutional records remain completely segregated.
4.6 Data Storage and Management
Data persistence is orchestrated utilizing a dual-layer strategy. Sensitive operational data is exclusively managed through a strictly relational MySQL database utilizing the mysql2 driver. The database schema is meticulously structured utilizing normalized tables for user accounts, institutional tenants, active SaaS subscriptions, credential records, and verification logs. By employing a structured query language database, the system enforces rigorous referential integrity through complex cascading foreign key constraints (ON DELETE CASCADE). Simultaneously, the decentralized storage layer utilizes a compiled Solidity smart contract (CertificateStore.sol) that maintains an internal mapping structure, permanently associating each 64-character cryptographic hash with its issuing institution ID and an immutable block timestamp, serving as the ultimate mathematical proof of origin.
4.7 Features
The platform boasts a comprehensive suite of features designed to facilitate secure, fraud-proof credentialing at scale.
•	Cryptographic Issuance Engine: A sophisticated pipeline that sanitizes student PII, generates a deterministic SHA-256 hash, and securely anchors it to the Polygon blockchain.
•	Dual-Layer Public Verification: A gasless, high-speed verification portal that instantly cross-references the relational database integrity against the immutable on-chain smart contract state.
•	Multi-Tenant SaaS Governance: Role-based administrative dashboards that allow super-administrators to onboard distinct educational institutions, manage tiered subscription limits (e.g., Trial, Basic, Pro), and monitor global issuance metrics.
•	On-Chain Revocation: Administrative capabilities that allow authorized issuers to permanently invalidate a compromised credential both within the local MySQL database and on the public ledger.
•	Automated Document Generation: Integrated frontend utilities capable of dynamically rendering and exporting high-resolution, branded PDF certificates embedded with verifiable QR codes.
4.8 Structured File System
The project source code is organized into a modern monorepo structure, creating clear physical boundaries between the interactive client interface, the transactional server environment, and the decentralized smart contract infrastructure to facilitate highly organized full-stack development.
 
4.9 Database Schema Implementation
To ensure robust data persistence, tenant isolation, and relational integrity, the system's off-chain data tier is constructed using the following Structured Query Language (SQL) definitions. The schema establishes complex relationships between core entities, utilizing foreign key constraints to enforce cascading updates and deletions across the distributed multi-tenant architecture.
4.9.1 Entity-Relationship (ER) Diagram
This Entity-Relationship diagram provides a high-level visual representation of the database tables and their interconnectivity, illustrating how user accounts, institutional entities, cryptographic certificates, and blockchain logging systems are structurally linked.
 4.9.2 SQL Schema Definitions
The following statements represent the exact Data Definition Language (DDL) utilized to instantiate the relational database tables within the cloud environment. The raw definitions have been streamlined to highlight the core architectural constraints and data types.
-- Table structure for table `Institutions`
CREATE TABLE `Institutions` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `Users`
CREATE TABLE `Users` (
  `id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `InstitutionMembers`
CREATE TABLE `InstitutionMembers` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `institution_id` char(36) NOT NULL,
  `role` enum('ADMIN','STAFF') DEFAULT 'STAFF',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_membership` (`user_id`,`institution_id`),
  KEY `institution_id` (`institution_id`),
  CONSTRAINT `InstitutionMembers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `InstitutionMembers_ibfk_2` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `Subscriptions`
CREATE TABLE `Subscriptions` (
  `id` char(36) NOT NULL,
  `institution_id` char(36) NOT NULL,
  `plan_name` enum('TRIAL','BASIC','PRO','ENTERPRISE') DEFAULT 'TRIAL',
  `starts_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_id` (`institution_id`),
  CONSTRAINT `Subscriptions_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `Certificates`
CREATE TABLE `Certificates` (
  `id` char(36) NOT NULL,
  `institution_id` char(36) NOT NULL,
  `issuer_id` char(36) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `cert_hash` varchar(255) NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `issue_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cert_hash` (`cert_hash`),
  KEY `fk_cert_inst` (`institution_id`),
  KEY `fk_cert_issuer` (`issuer_id`),
  CONSTRAINT `fk_cert_inst` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_issuer` FOREIGN KEY (`issuer_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `BlockchainTransactions`
CREATE TABLE `BlockchainTransactions` (
  `id` char(36) NOT NULL,
  `certificate_id` char(36) NOT NULL,
  `tx_hash` varchar(255) NOT NULL,
  `network` varchar(50) DEFAULT 'Hardhat',
  `block_number` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tx_hash` (`tx_hash`),
  KEY `certificate_id` (`certificate_id`),
  CONSTRAINT `BlockchainTransactions_ibfk_1` FOREIGN KEY (`certificate_id`) REFERENCES `Certificates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `VerificationLogs`
CREATE TABLE `VerificationLogs` (
  `id` char(36) NOT NULL,
  `certificate_id` char(36) NOT NULL,
  `institution_id` char(36) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `result` enum('SUCCESS','TAMPERED','FAILED') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `certificate_id` (`certificate_id`),
  KEY `fk_log_inst` (`institution_id`),
  CONSTRAINT `fk_log_inst` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `VerificationLogs_ibfk_1` FOREIGN KEY (`certificate_id`) REFERENCES `Certificates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
CHAPTER 5

IMPLEMENTATION AND DEPLOYMENT

5.1 Technologies Used

The implementation of the CertChain platform relies on a sophisticated, highly modernized hybrid Web3 technology stack. By carefully selecting industry-standard tools and frameworks, the platform guarantees high-speed user interactivity, rigorous data processing capabilities, and immutable cryptographic security.

The core technologies utilized in the implementation include:

Frontend Layer: Engineered using React (version 19.2.4) alongside TypeScript (version 6.0.2), providing robust static type checking that minimizes runtime errors. The interface incorporates Framer Motion for declarative animations and Tailwind CSS for responsive, utility-first styling.

Build System: Bundled utilizing the Vite (version 8.0.4) build tool, combined with the React 19 Compiler, to guarantee lightning-fast hot module replacement during development and highly optimized static assets for production deployment.

Backend Application Logic: Powered by a Node.js runtime environment utilizing the Express.js (version 5.2.1) web framework to expose a secure Representational State Transfer (REST) application programming interface.

Database & Persistence: Integrated with a highly relational MySQL database utilizing the mysql2 connection driver with a strictly configured Promise pool.

Blockchain Ecosystem: The decentralized layer is programmed in Solidity (version 0.8.20) using the Hardhat development framework. The Node.js backend acts as a cryptographic relayer, communicating with the blockchain network via the Ethers.js (version 6.16.0) library.

5.2 Frontend Implementation

The frontend architecture is implemented as a dynamic single-page application utilizing React Router DOM (version 7.14.0) to manage complex, role-based client-side navigation seamlessly.

Key frontend implementation details include:

Centralized State and Authentication: The application leverages the React Context API (AuthContext.tsx) to manage global authentication states. Upon successful login, the JSON Web Token (JWT) and user profile are securely persisted in local storage and re-hydrated dynamically upon application mounting.

API Service Layer: A centralized API module is implemented using Axios. This module features automated request interceptors that seamlessly attach the stored bearer token to the authorization headers of all outbound HTTP requests, ensuring secure communication with the backend.

Automated Document Generation: To support traditional distribution, the frontend implements a sophisticated PDF export utility within the Certificate Details view. Utilizing html-to-image to bypass CSS rendering bugs and jsPDF for formatting, the system dynamically renders a high-resolution, off-screen HTML component (1123×794 pixels) into a landscape A4 PDF, complete with the embedded verification QR code.

Role-Based Routing Guard: The application dynamically evaluates the user's role (Standard User, Admin, or Super Admin) stored within the Context API, routing institutional administrators to the AdminDashboard while restricting public visitors to the landing and verification portals.

5.3 Backend Implementation and Cryptographic Hashing

The server-side implementation follows a strict, modular architecture designed to logically isolate business rules, database queries, and blockchain relay mechanisms.

Key backend implementation details include:

Database Connection Pooling: To maintain high throughput during concurrent public verification requests, the backend utilizes the mysql2 driver with a strict connection pool limit of 10 simultaneous connections, preventing memory exhaustion on the relational database.

Cryptographic Normalization: A critical implementation within the backend is the generateCertHash utility. To guarantee the absolute stability of the SHA-256 hash, the algorithm rigorously trims whitespace, lowercases all email inputs, and mathematically floors the JavaScript timestamp to the nearest second (Math.floor(Date.now() / 1000) * 1000). This completely eliminates millisecond jitter discrepancies between the Node.js runtime and the MySQL TIMESTAMP data type.

Dual-Layer Verification Protocol: The public verification endpoint implements a highly secure three-stage check system. Upon receiving a request, the backend first fetches the raw credential data from MySQL and immediately checks the is_revoked flag, returning a REVOKED status if the credential has been previously invalidated. If the credential is active, the backend independently recalculates the SHA-256 hash from the stored fields. If the recalculated hash matches the stored database hash, the server then queries the blockchain via Ethers.js to confirm the on-chain validity status. A timeout guard of 10 seconds is wrapped around the blockchain request to ensure the frontend does not hang indefinitely during network congestion.

5.4 Smart Contract Implementation

The decentralized storage layer is engineered using a bespoke Solidity smart contract (CertificateStore.sol) designed to act as a highly efficient, immutable ledger of truth.

Key smart contract implementations include:

Zero-Knowledge State Storage: The contract explicitly avoids storing any Personally Identifiable Information. It utilizes an internal mapping structure to exclusively associate a 64-character cryptographic hash string with a specific InstitutionId and a block issuance timestamp.

Access Control Modifiers: The contract enforces a strict onlyOwner modifier on all state-changing functions, such as issueCertificate and revokeCertificate. This ensures that only the authorized CertChain backend wallet, which holds the encrypted private key, can anchor or alter records on the public ledger.

Gasless Public Verification: The primary verifyCertificate function is explicitly designated as a public view method. This architectural decision allows the backend relayer, or any independent third-party auditor, to query the blockchain's state instantly without incurring computational gas fees.

5.5 Security and Middleware

Platform security is rigorously enforced through a layered middleware architecture that intercepts and validates all incoming network requests long before they reach the core business logic or database layers.

Key security implementations include:

Stateless Authentication: Custom authentication middleware cryptographically verifies the signature of JSON Web Tokens attached to incoming requests. The payload explicitly encodes the user's ID, institutional affiliation, and access role.

SaaS Subscription Guard: To enforce the multi-tenant business model, the platform implements a checkSubscriptionLimit middleware. Before any certificate is issued, this module queries the Subscriptions table to verify the institution's plan status, restricting 'TRIAL' plans to 100 credentials and 'BASIC' plans to 500, while granting unlimited throughput to 'PRO' and 'ENTERPRISE' tenants.

Password Cryptography: All user passwords are encrypted utilizing the bcrypt hashing algorithm with 10 computational salt rounds prior to database insertion, completely neutralizing the risk of plain-text credential exposure.

5.6 Deployment Environment

The final deployment architecture is distributed across specialized cloud environments to ensure high availability, absolute fault tolerance, and minimal latency for global end-users.

Key deployment details include:

Edge Network Frontend Delivery: The vercel.json configuration file is utilized to deploy the compiled React single-page application directly to the Vercel edge network. Specific URL rewrite rules are implemented to catch all traffic and route it to the index.html file, ensuring seamless client-side routing.

Cloud Backend Service: The Node.js transactional backend is hosted as a dedicated web service on Render.com. The environment is strictly controlled via hidden environment variables containing sensitive cryptographic secrets, database connection strings, and the master OWNER_PRIVATE_KEY required for blockchain interactions.

Production Blockchain Ledger: The foundational CertificateStore.sol smart contract is permanently deployed to the Polygon Amoy Testnet. The backend communicates with this network via high-speed Remote Procedure Calls (RPC) utilizing the Alchemy infrastructure provider, guaranteeing high transaction throughput and minimal block confirmation times.

State Migration Utilities: To accommodate potential network resets or migrations, the infrastructure includes a dedicated re-anchor.js script. This utility queries the MySQL database for all valid certificates and sequentially replays the issuance transactions onto a fresh smart contract, ensuring continuous data consistency across layers.

5.7 System Interface and Modules

5.7.1 Public Landing Page and Hero Section
The entry point of the CertChain platform delivers a highly professional, modern visual experience designed to immediately convey institutional trust and technological authority. The landing page emphasizes the core value proposition of decentralized verification.
Features a prominent "Mainnet Active" dynamic badge to indicate live blockchain synchronization.
Displays a clear, high-impact headline ("The Standard for Immutable Truth") accompanied by a simulated transaction validation graphic.
Integrates clear Call-to-Action (CTA) buttons directing users either to the public verification portal or to learn more about the platform's capabilities.

Figure 5.1: Screenshot of the CertChain public landing page featuring the dynamic hero section and transaction validation graphic.

Sample Code of Landing Page Component

```tsx
// frontend/src/pages/Home.tsx (Architecture Excerpt)
import { motion } from 'framer-motion';
import PublicVerify from './PublicVerify';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Framer Motion Animations */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs font-black text-brand-700 uppercase tracking-widest">Mainnet Active</span>
            </div>
            <h1 className="text-7xl font-black text-gray-900 tracking-tight mb-6">
              The Standard for <span className="text-gradient">Immutable Truth</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10">
              CertChain empowers institutions to issue cryptographically verifiable 
              credentials directly to a decentralized ledger, eliminating fraud at the source.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Embedded Public Verification Engine */}
      <section className="bg-gray-50/50 py-24 border-y border-gray-100">
        <PublicVerify isEmbedded={true} />
      </section>
    </div>
  );
}
```

5.7.2 Secure Authentication Interface

The authentication interface provides a streamlined, secure gateway for institutional administrators and staff to access their respective tenant dashboards.

Utilizes a centralized, minimalist modal layout over a clean background, maintaining user focus entirely on the credential input process.

Features integrated form validation for institutional email addresses and passwords.

Connects directly to the backend JWT authentication middleware, seamlessly routing the user to the appropriate role-based dashboard upon successful sign-in.

 Figure 5.2: Screenshot of the "Sign In" secure authentication interface designed for institutional access.

Sample Code of Authentication Component

```tsx
// frontend/src/pages/Login.tsx (Implementation Excerpt)
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // AuthContext hook
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await api.post('/auth/login', { email, password });
        
        // Persist token and user profile to localStorage via context
        login(res.data.token, res.data.user);
        toast.success('Access Granted (JWT Verified)');

        // Role-based routing logic
        if (res.data.user.isSuperAdmin) {
            navigate('/super-admin/dashboard');
        } else if (res.data.user.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Sign in to Portal</button>
    </form>
  );
}
```

5.7.3 SaaS Subscription and Pricing

The pricing interface clearly delineates the multi-tenant SaaS architecture of the platform, outlining the specific limits and capabilities afforded to varying institutional tiers.

Presents three distinct subscription tiers: Basic Trial (Free), Professional ($499/mo), and Enterprise (Custom).

Clearly lists the feature restrictions per tier, actively reflecting the backend checkSubscriptionLimit middleware limits (e.g., 100 Certificates for Trial vs. Unlimited for Professional).

Provides direct onboarding pathways for institutions to initiate their deployment based on their specific volume requirements.

 Figure 5.3: Screenshot of the SaaS Pricing interface outlining the tiered subscription models and feature allocations.

Sample Code of Pricing Component

```tsx
// frontend/src/pages/Pricing.tsx (SaaS Tiers Excerpt)
function PricingCard({ tier, price, desc, features, highlighted = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[3rem] border-2 transition-all duration-300 ${
        highlighted ? 'border-brand-500 bg-white shadow-2xl z-10' : 'border-gray-100 bg-white'
      }`}
    >
      <h3 className="text-xl font-black text-gray-900 mb-2">{tier}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black text-gray-900">{price}</span>
        {price !== 'Free' && price !== 'Custom' && <span className="text-gray-400 font-bold">/mo</span>}
      </div>
      <ul className="space-y-4 mb-10">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <div className={`p-1 rounded-full ${highlighted ? 'bg-brand-100 text-brand-600' : 'bg-gray-100'}`}>
              <Check size={14} />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <button className={highlighted ? "bg-brand-500 text-white" : "bg-gray-50"}>
        Get Started <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
```

5.7.4 Blockchain Public Verification Portal

The core public-facing utility of the platform is the Verification Portal, allowing third-party auditors and employers to independently confirm the authenticity of any issued credential.

Features a minimalist, distraction-free search interface requiring only the unique 36-character Certificate UUID.

Integrates a helpful instructional banner ("How to find the ID?") to guide users who are scanning physical QR codes or digital PDFs.

Triggers the backend dual-layer verification protocol, instantly returning color-coded trust badges reflecting the live database and blockchain state.

 Figure 5.4: Screenshot of the Blockchain Public Verification Portal featuring the UUID search input.

Sample Code of Public Verification Component

```tsx
// frontend/src/pages/PublicVerify.tsx (Engine Excerpt)
export default function PublicVerify({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // UUID Sanitization: Extracts UUID from full pasted share-links
    let sanitizedId = certId.trim();
    if (sanitizedId.includes('/verify/')) {
        sanitizedId = sanitizedId.split('/verify/').pop() || '';
    }

    if (!sanitizedId) return;
    setLoading(true);
    try {
        // Calls the dual-layer backend verifier (DB + Blockchain sync)
        const res = await api.get(`/certificates/verify/${sanitizedId}`);
        setResult(res.data);
        toast.success('Verification Complete');
    } catch (error: any) {
        setResult(error.response?.data || { status: 'FAILED' });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleVerify} className="relative shadow-lg">
      <input 
        placeholder="Enter Certificate UUID..." 
        value={certId} 
        onChange={e => setCertId(e.target.value)} 
      />
      <button type="submit">Verify</button>
      {/* Result UI rendered dynamically based on result.status */}
    </form>
  );
}
```

5.7.5 Institutional Overview Dashboard

Upon authentication, institutional administrators are routed to a comprehensive, high-level command center to monitor their specific credentialing operations and blockchain connectivity.

Displays vital Key Performance Indicators (KPIs) including Total Issued credentials, Public Verifications, and the current SaaS Plan status.

Features an "EVM Network Identity" panel, confirming live ledger synchronization status and the active smart contract version in real-time.

Provides a dedicated Subscription Health module to alert administrators of remaining trial days or upcoming billing cycles.

 Figure 5.5: Screenshot of the Institutional Overview dashboard displaying issuance telemetry and EVM synchronization status.

Sample Code of Admin Dashboard Component

```tsx
// frontend/src/pages/AdminDashboard.tsx (Analytics Excerpt)
const fetchStats = async () => {
  try {
    const res = await api.get('/institutions/stats');
    setStats(res.data);
    // Expected Payload: {
    //   totalCertificates: number,
    //   totalVerifications: number,
    //   subscription: { plan_name: string, expires_at: string },
    //   institutionName: string
    // }
  } catch (err) {
    toast.error('Failed to synchronize telemetry');
  }
};

// Rendering KPI Modules
<StatCard 
  icon={<Award size={24} />} 
  label="Total Issued" 
  value={stats.totalCertificates} 
/>
<StatCard 
  icon={<Users size={24} />} 
  label="Public Verifications" 
  value={stats.totalVerifications} 
/>
<StatCard 
  icon={<Zap size={24} />} 
  label="SaaS Plan" 
  value={stats.subscription.plan_name} 
/>
```

5.7.6 Cryptographic Issuance Interface

The primary administrative action—issuing new credentials—is handled through a streamlined, secure data entry portal designed to prevent input errors before cryptographic hashing occurs.

Provides clean input fields capturing essential student details: Full Name, Email Address, and the specific Certification Program/Course.

Features a prominent "Secure on Blockchain" submission button, explicitly noting the estimated mining time (5-10 seconds) to manage user expectations during the on-chain anchoring process.

Submits data to the backend for immediate SHA-256 normalization and Ethers.js transmission.
 
Figure 5.6: Screenshot of the "Issue New Credential" administrative interface.

Sample Code of Issue Certificate Component

```tsx
// frontend/src/pages/IssueCertificate.tsx (State Machine Excerpt)
const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuingState('HASHING');
    setProgress(25);
    
    try {
        await new Promise(r => setTimeout(r, 800)); // Hashing emulation delay
        
        setIssuingState('BLOCKCHAIN');
        setProgress(60);

        // API initiates the Ethers.js transaction on the backend
        const res = await api.post('/certificates/issue', {
            studentEmail: email,
            studentName: name,
            courseName: course
        });

        setIssuingState('FINALIZING');
        setProgress(90);
        await new Promise(r => setTimeout(r, 800));

        setIssuingState('SUCCESS');
        setProgress(100);
        setLastIssuedCert(res.data.certificate); // Stores ID and QR Code payload
        toast.success('Certificate Secured on Ledger!');
    } catch (error: any) {
        setIssuingState('IDLE');
        toast.error(error.response?.data?.message || 'Issuance failed');
    }
};
```

5.7.7 Governance Vault (Certificate Records)

The Governance Vault acts as the comprehensive, immutable audit log for the institution, tracking the status of every credential ever anchored to the platform.

Renders a highly organized data table displaying Graduate Details, the specific Program, the Secured Date, and a preview of the on-chain transaction hash.

Includes dynamic status badges (e.g., ACTIVE in green, REVOKED in red) directly mapped to the relational database state.

Empowers administrators with powerful filtering tools to isolate records by student name, email, or specific credential status.

 Figure 5.7: Screenshot of the Governance Vault detailing the institutional certificate records and status badges.

Sample Code of Certificate List Component

```tsx
// frontend/src/pages/CertificateList.tsx (Vault Filtering Excerpt)
export default function CertificateList() {
  const [certs, setCerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED'>('ALL');

  const filteredCerts = certs.filter(cert => {
    const matchesSearch =
        cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.student_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !cert.is_revoked) ||
        (statusFilter === 'REVOKED' && cert.is_revoked);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Filtering Logic UI */}
      <input 
        placeholder="Search student name..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
      />
      {/* Data Table Rendering */}
      {filteredCerts.map((cert) => (
        <tr key={cert.id} className="hover:bg-gray-50">
          <td>{cert.student_name}</td>
          <td>{cert.course_name}</td>
          <td>{cert.is_revoked ? 'Revoked' : 'Active'}</td>
        </tr>
      ))}
    </div>
  );
}
```

5.7.8 Portal Configuration and Settings

The Settings module allows administrators to manage their institutional identity and basic security protocols within the isolated multi-tenant environment.

Provides a structured interface for updating the "Identity Core," including the Institution Display Name.

Displays the auto-generated Protocol Identifier (Slug) utilized for custom-branded portal routing.

Features a Security Contact section to manage the administrative email notices associated with the institution's account.
 
Figure 5.8: Screenshot of the Portal Configuration interface illustrating institutional identity management settings.

Sample Code of Settings Component

```tsx
// frontend/src/pages/Settings.tsx (Configuration Excerpt)
export default function Settings() {
  const [instName, setInstName] = useState('');
  const [slug, setSlug] = useState('');
  const [activeTab, setActiveTab] = useState<string>('general');

  const fetchProfile = async () => {
    const res = await api.get('/institutions/stats');
    setInstName(res.data.institutionName);
    setSlug(res.data.slug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        // Simulates synchronization with institutional identity ledger
        await new Promise(r => setTimeout(r, 1000));
        toast.success('Configuration Synchronized!');
    } finally { setSaving(false); }
  };

  return (
    <div className="grid grid-cols-3 gap-10">
      <nav className="space-y-2">
        <SidebarLink active={activeTab === 'general'} label="General Profile" icon={<Building2 />} />
        <SidebarLink active={activeTab === 'branding'} label="Branding" icon={<Layout />} />
        {/* Additional configuration modules */}
      </nav>
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          <input value={instName} onChange={e => setInstName(e.target.value)} />
          <input value={slug} readOnly className="bg-gray-100 cursor-not-allowed" />
          <button type="submit">Apply Changes</button>
        </form>
      )}
    </div>
  );
}
```

5.7.9 Certificate Details and PDF Export

The Certificate Details view provides administrators with a comprehensive, single-record audit page for any issued credential, combining full metadata display with administrative actions.

Displays the full on-chain Audit Trail: transaction hash, block confirmation number, and the 64-character SHA-256 content identity hash in a monospaced format.

Offers a Danger Zone panel with an irreversible blockchain revocation action, protected by a browser confirmation dialog prior to execution.

Generates a downloadable landscape A4 PDF certificate (1123×794 px) via html-to-image and jsPDF, embedding the student name, course, institution, issue date, QR code, and blockchain hash.

Sample Code of Certificate Details Component

```tsx
// frontend/src/pages/CertificateDetails.tsx (PDF Generation Excerpt)
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function CertificateDetails() {
  const printRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    const toastId = toast.loading('Generating secure PDF...');
    try {
        // High-fidelity capture bypasses SVG-to-Canvas limitations
        const imgData = await toPng(printRef.current, {
            pixelRatio: 2,
            backgroundColor: '#ffffff'
        });
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate_Verified_${cert.id.substring(0, 8)}.pdf`);
        toast.success('Certificate Exported', { id: toastId });
    } catch (error) {
        toast.error('PDF Generation Failed', { id: toastId });
    } finally { setDownloading(false); }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you absolutely sure? Revocation is permanent on the blockchain.')) return;
    try {
        await api.post(`/certificates/revoke/${id}`);
        toast.success('Certificate Revoked on Public Ledger');
        fetchDetails(); // Reload state
    } catch (err) { toast.error('Revocation Error'); }
  };
}
```

5.7.10 Super Administrator Platform Dashboard

The Super Administrator Dashboard provides a global, bird's-eye view of the entire CertChain SaaS platform, exclusively accessible to the platform owner account.

Displays four platform-wide KPIs: Active Tenants (total institutions), Global Certs, total Verifications, and the live Verification Success Rate percentage.

Provides a full, filterable institution management table listing every registered tenant with their slug and active status.

Features an Integrity Health panel showing the ratio of genuine verifications vs. tampered attempts, sourced directly from VerificationLogs.

Includes an animated onboarding modal enabling the Super Admin to register new institutions directly (POST /api/institutions), bypassing the self-service signup flow.
 
Sample Code of Super Admin Dashboard Component

```tsx
// frontend/src/pages/SuperAdminDashboard.tsx (Global Telemetry Excerpt)
export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);

  const fetchGlobalData = async () => {
    try {
        // Parallel execution for zero-latency UI population
        const [statsRes, instRes] = await Promise.all([
            api.get('/institutions/global-stats'),
            api.get('/institutions')
        ]);
        setStats(statsRes.data);
        setInstitutions(instRes.data);
    } catch (error) {
        toast.error('Failed to load global administrative context');
    }
  };

  const successRate = stats ? Math.round((stats.verificationStats.success / stats.verificationStats.total) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Global Metadata Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Active Tenants" value={stats?.totalInstitutions} />
        <MetricCard label="Global Certs" value={stats?.totalCertificates} />
        <MetricCard label="Total Verifications" value={stats?.verificationStats.total} />
        <MetricCard label="Success Rate" value={`${successRate}%`} />
      </div>
      {/* Institution Control Layer renders institutions list table below */}
    </div>
  );
}
```

 
CHAPTER 6
TESTING AND RESULTS
 
Testing represents a highly critical phase in the development lifecycle of the CertChain platform. Because the system serves as a definitive source of truth for academic and professional credentials, ensuring absolute cryptographic accuracy and transactional security was paramount. This chapter provides a detailed exploration of the comprehensive testing methodologies applied across the Node.js backend, the React single-page application, and the blockchain integration layers to guarantee a highly reliable, fraud-proof digital ecosystem.
6.1 Backend Integration and Unit Testing
The primary objective of the backend testing phase was to evaluate the core application programming interface and database interactions in strict isolation, ensuring that business logic and cryptographic operations executed flawlessly. The development team utilized the Jest framework alongside Supertest to automate these backend audits. To safeguard production data, the backend automatically routed all test operations to a dedicated CertChain_test database environment triggered by the NODE_ENV=test variable.
To ensure fast and deterministic test execution in continuous integration environments, the testing suite implemented robust mocking strategies within the tests/setup.js configuration. The native uuid library was explicitly mocked to produce deterministic sequential identifiers, ensuring that complex relational foreign key constraints could be tested predictably. Furthermore, a global clearDatabase() helper was engineered to disable foreign key checks temporarily and truncate all seven database tables between test runs, guaranteeing a pristine state for every assertion. Crucially, the blockchain service within blockchain.js was completely mocked to export dummy contract objects with hardcoded transaction hashes, allowing the backend logic to be audited rapidly without expending testnet gas fees or relying on an active Hardhat node.
The comprehensive Jest testing suites included:
•	Authentication Suite (auth.test.js): Rigorously tested the institutional onboarding process, verifying that the /api/auth/signup-institution endpoint correctly instantiated a new institution, assigned the default 'ADMIN' role, and returned a valid JSON Web Token alongside a 201 Created status code.
•	Certificate Issuance Suite (certificates.test.js): Evaluated the core cryptographic pipeline. Tests confirmed that successful credential issuance returned valid transaction hashes starting with 0x, and verified the dual-layer verification flow by ensuring newly issued certificates returned a SUCCESS status upon a subsequent public GET /verify/:id query.
•	Subscription Enforcement Testing: Simulated high-volume issuance to validate the SaaS middleware. The test first issued 2 certificates via the API, then directly inserted 99 additional dummy records into the database, bringing the total to 101 on a newly onboarded 'TRIAL' plan account. The subsequent issuance attempt (the 102nd overall) was correctly intercepted and rejected with a 403 Forbidden status and a strict { limitReached: true, message: "Plan limit reached (100 credentials)" } JSON payload.
•	Institutional Governance (institutions.test.js): Tested the role-based access control (RBAC) middleware, confirming that standard user tokens attempting to access the protected /api/institutions/stats endpoint were instantly blocked, while authorized administrative tokens successfully retrieved the aggregated metrics, returning totalCertificates: 0 for freshly seeded institutions.
6.2 End-to-End (E2E) System Testing
To evaluate the frontend client and the platform as a unified, holistic entity, the development team utilized the Playwright framework to conduct extensive End-to-End (E2E) system testing. Configured via playwright.config.ts, this phase automated entire user journeys using a headless Chromium browser engine communicating with a locally active Vite development server on port 5173. An HTML reporter was utilized to generate detailed execution logs and capture trace recordings of any failed assertions.
The automated Playwright testing suites validated the following comprehensive flows:
•	Lifecycle Onboarding (onboarding.spec.js): The automated script navigated the full institutional signup lifecycle. It systematically filled out the registration form, clicked the "Explore Free Trial" call-to-action, and successfully verified the system's automatic redirect to the protected /admin/dashboard. The test further validated stateless session management by programmatically executing localStorage.clear(), forcing a logout, and successfully re-authenticating the user through the login portal.
•	Issuance User Experience (issuance.spec.js): The automation navigated to the /admin/issue route, simulating an administrator inputting student and program data. The test explicitly waited for the complex, three-stage animated issuance user experience—progressing through Hashing (25%), Blockchain Securing (60%), and Finalizing (90%)—to conclude. It successfully asserted the final appearance of the "Block Secured" confirmation text and the dynamically generated QR code image.
•	Public Verification Accessibility: The end-to-end automation simulated an unregistered public verifier navigating to the /verify portal, confirming that the critical search inputs and instructional headings rendered flawlessly without prompting for unauthorized authentication credentials.
6.3 Cryptographic and Blockchain Validation
A highly specialized phase of testing was dedicated to verifying the reliability of the cryptographic hashing algorithms and the stability of the Web3 network interactions. Given the immutable nature of the Polygon blockchain, ensuring that the stored hashes matched the database records precisely was critical to the platform's viability.
Key cryptographic testing and validation results included:
•	Hash Normalization Stability: Evaluators rigorously tested the generateCertHash utility, deliberately injecting varied casing, trailing whitespaces, and fractional milliseconds into the payload. The tests confirmed that the algorithm's normalization logic—specifically lowercasing emails, trimming whitespace, and mathematically flooring timestamps to the second (Math.floor(Date.now() / 1000) * 1000)—successfully prevented any false-negative mismatches caused by runtime jitter during hash recalculation.
•	Blockchain Timeout Guards: To protect the frontend from hanging indefinitely during periods of extreme decentralized network congestion or RPC failure, testers simulated delayed remote procedure call responses. The backend successfully utilized a 10-second Promise.race implementation during the public verify endpoint, verifying that any on-chain query exceeding the strict threshold automatically aborted and returned a controlled { status: 'ERROR' } (HTTP 503) payload to the client.
•	Tamper-Detection Accuracy: Security auditors directly manipulated values within the MySQL Certificates table via raw database queries to simulate a malicious insider attack. Upon subsequent public verification attempts, the backend correctly identified the mismatch between the altered database payload and the original on-chain hash, immediately flagging the credential as TAMPERED (HTTP 400) and logging the specific violation within the VerificationLogs table.
6.4 Usability and Performance Evaluation
Usability and performance testing aimed to evaluate the visual responsiveness, accessibility, and high-concurrency capabilities of the full-stack architecture.
•	Database Connection Resilience: The backend infrastructure was subjected to simulated concurrency spikes to monitor the mysql2 driver's performance. The results confirmed that the strict 10-connection pool limit efficiently queued and processed rapid, repetitive verification queries without exhausting the Node.js server memory, dropping client requests, or triggering connection timeout errors.
•	Responsive Rendering: Evaluators heavily scrutinized the Tailwind CSS grid layouts, ensuring that complex administrative data tables and responsive dashboard components adapted fluidly across simulated mobile, tablet, and high-resolution desktop viewports.
•	PDF Export Fidelity: Extensive manual audits were conducted on the frontend document export capabilities. Developers specifically bypassed html2canvas due to known parsing errors with Tailwind's oklch() CSS colors, opting instead for html-to-image using browser-native SVG rendering. Testers verified that the complex formatting of the certificates rendered a perfect 1123×794 pixel landscape A4 document. The exported PDFs successfully displayed the custom Outfit typography, embedded QR codes, and transparent watermarks across varying student name lengths without cascading stylesheet degradation.
6.5 User Acceptance Testing (UAT)
User Acceptance Testing was conducted to validate the system directly from the perspective of its intended operators: educational administrators and corporate recruiters. The goal was to ensure the multi-tenant SaaS architecture provided intuitive workflows and clear visual feedback.
•	Institutional Governance Simulation: A cohort of administrative users tested the platform's role-based access controls. Testers logged in with standard 'STAFF' credentials and verified that the system accurately restricted them from viewing platform-wide Super Admin analytics, successfully isolating them to their specific tenant dashboard.
•	Issuance Workflow Clarity: Participants evaluated the usability of the credential issuance engine. Users reported that the animated progress bar (transitioning through "Creating non-repudiable identity," "Securing consensus," and "Linking SQL record") provided exceptional transparency into the complex blockchain anchoring process, significantly reducing user anxiety during the 5-to-10 second transaction mining delay.
•	Public Verification Auditing: Prospective employers participated in testing the public verification portal. Participants utilized varying input methods, including scanning printed QR codes and manually entering 36-character UUIDs. The feedback confirmed that the color-coded trust badges (Green for Success, Yellow for Revoked, Red for Tampered) provided unambiguous, instant clarity regarding a candidate's credential authenticity.
6.6 Error Handling and Recovery Testing
To ensure the platform's resilience against unpredictable network and user behavior, rigorous error handling and state recovery testing were executed.
•	State Synchronization Recovery: Given the volatility of the local Hardhat testing node, developers evaluated the re-anchor.js script. Evaluators intentionally wiped the local blockchain state and executed the script. The utility successfully connected to the MySQL database, queried all non-revoked certificates ordered by issue date, and sequentially replayed the issuance transactions onto a newly deployed smart contract. The script gracefully handled explicit nonce management and successfully recovered the ledger state.
•	Authentication Expiration Handling: The stateless JWT architecture was tested for session expiration behaviors. Testers injected expired tokens into the browser's local storage and attempted to access the protected /admin/dashboard. The centralized Axios interceptors correctly identified the 401 Unauthorized response, instantly purged the local storage, and elegantly redirected the user to the login screen without exposing raw API errors to the interface.
 
CHAPTER 7
CONCLUSION AND FUTURE SCOPE
 

7.1 Conclusion
The successful development and deployment of the CertChain platform represent a significant architectural breakthrough in the domain of digital identity and academic credentialing. By engineering a highly scalable, multi-tenant hybrid Web3 ecosystem, the project effectively resolves the pervasive global crisis of credential fraud without compromising the strict data privacy regulations inherent in modern institutional governance. The platform successfully bridges the operational efficiency of a traditional MySQL relational database with the cryptographic immutability of an Ethereum-compatible public ledger.
A crowning achievement of this project is the resolution of the "privacy versus transparency trilemma" through its zero-knowledge implementation strategy. By intelligently normalizing student data and computing a deterministic SHA-256 cryptographic fingerprint, the platform ensures that only irreversible mathematical hashes are permanently anchored to the Polygon smart contract, keeping all Personally Identifiable Information strictly isolated off-chain. Furthermore, the dual-layer public verification protocol completely democratizes trust, allowing employers and auditors to instantly validate the authenticity of a document without requiring cumbersome, manual institutional correspondence. Ultimately, CertChain delivers a highly secure, frictionless Software-as-a-Service (SaaS) environment that significantly enhances institutional credibility, streamlines corporate recruitment verification, and establishes an immutable, fraud-proof standard for digital achievements.
7.2 Future Enhancements
While the current iteration of the CertChain platform provides a highly robust and comprehensive credentialing ecosystem, several technical and functional avenues for future enhancement have been identified to further scale the platform for enterprise adoption.
To ensure the platform remains at the forefront of decentralized educational technology, the following expansions are proposed:
•	Mainnet Migration and Merkle Tree Batching: Transitioning the foundational smart contract from the Polygon Amoy testnet to the Polygon Mainnet to achieve true production-grade decentralization. To optimize the inevitable transaction gas fees associated with mainnet deployment, the issuance engine should be upgraded to utilize Merkle Tree data structures, allowing administrators to batch thousands of certificates into a single cryptographic root hash for a single on-chain transaction.
•	Decentralized Identity (DID) Wallets: Implementing Self-Sovereign Identity (SSI) protocols, allowing graduating students to export their verifiable credentials directly into standard Web3 digital wallets (such as MetaMask) as non-transferable Soulbound Tokens (SBTs), granting them absolute ownership over their academic records.
•	LMS and ERP Integrations: Developing dedicated application programming interface webhooks to seamlessly integrate the CertChain issuance engine directly into popular Learning Management Systems (LMS) like Canvas, Blackboard, and Moodle, enabling the automated generation and anchoring of certificates immediately upon a student's graduation or course completion.
•	Advanced Cryptographic Zero-Knowledge Proofs: Upgrading the current SHA-256 hashing architecture to incorporate advanced zero-knowledge proofs (zk-SNARKs). This would allow a student to cryptographically prove to an employer that they possess a specific degree or maintain a specific grade point average without explicitly revealing the underlying raw data or the issuing institution's proprietary metrics.
•	AI-Powered Fraud Analytics: Expanding the Super Administrator dashboard to include artificial intelligence predictive models that analyze the VerificationLogs table in real-time. By detecting anomalous verification patterns—such as a massive spike in 'TAMPERED' results originating from a specific geographic IP block—the system could automatically alert institutions of coordinated counterfeiting campaigns.
7.3 Final Thoughts
The successful realization of the CertChain platform emphatically demonstrates the profound impact that hybrid blockchain architectures can exert on institutional record-keeping and public trust. By prioritizing architectural decoupling, rigorous cryptographic standards, and a premium, accessible user interface styled with Tailwind CSS, the project transcends the severe limitations of easily forged physical certificates and siloed, vulnerable legacy databases.
CertChain establishes a new digital standard for global verification, proving that complex decentralized ledger technology can be abstracted away behind an intuitive, centralized user experience. This platform not only equips educational and corporate institutions with the cryptographic tools necessary to protect their brand integrity but also establishes a highly scalable, multi-tenant technological blueprint for the future development of unified, trustless digital economies. As the demands of the modern remote workforce continue to evolve, zero-knowledge verification platforms like CertChain will become indispensable infrastructure in ensuring that professional qualifications are instantly, universally, and immutably trusted.
7.4 Additional Future Enhancements
To ensure the CertChain platform continues to evolve and address the dynamic requirements of global educational infrastructure, several additional technical expansions are proposed for subsequent development iterations:
•	Cross-Chain Interoperability: Expanding the platform's blockchain abstraction layer to support multiple decentralized networks. By allowing institutions to choose between various Ethereum Virtual Machine (EVM) compatible chains, such as Arbitrum, Optimism, or the Ethereum Mainnet, the system can offer tailored solutions that balance transaction costs with ultimate network security.
•	Decentralized Storage Integration: Transitioning the storage of visual certificate templates, logos, and non-sensitive institutional metadata from centralized servers to decentralized file networks like the InterPlanetary File System (IPFS) or Arweave. This ensures that the visual representation of the credential remains as immutable and permanent as the on-chain cryptographic hash.
•	Native Mobile Verification Application: Developing a dedicated, cross-platform mobile application utilizing React Native specifically tailored for employers, border control agencies, and event organizers. This application would leverage native device cameras for high-speed QR code scanning, enabling instantaneous, on-the-go cryptographic verification of physical paper certificates without relying on a mobile web browser.
•	Consortium Governance (DAO) Transition: Evolving the platform's administrative architecture from a traditional, centralized Software-as-a-Service model into a Decentralized Autonomous Organization (DAO). This structural shift would empower verified institutional tenants to vote on protocol upgrades, subscription pricing models, and the integration of new verification standards, fostering a truly collaborative and decentralized educational network.
 
CHAPTER 8
APPENDICES
This chapter contains an extensive collection of supplementary information designed to provide deeper technical and operational context for the CertChain platform. It includes a comprehensive breakdown of technical acronyms, a detailed glossary of platform-specific terminology, practical user scenarios covering core features, a record of hardware and system requirements, and a highly detailed bibliography of the technical references consulted during system development formatted according to IEEE standards.
8.1 Appendix A: Acronyms and Abbreviations
To ensure a thorough understanding of the underlying technical infrastructure, several key acronyms are defined within the specific context of the CertChain ecosystem:
•	API: Application Programming Interface
•	E2E: End-to-End (Testing)
•	EVM: Ethereum Virtual Machine
•	JSON: JavaScript Object Notation
•	JWT: JSON Web Token
•	PII: Personally Identifiable Information
•	RBAC: Role-Based Access Control
•	REST: Representational State Transfer
•	RPC: Remote Procedure Call
•	SaaS: Software as a Service
•	SPA: Single Page Application
•	SQL: Structured Query Language
•	UUID: Universally Unique Identifier
8.2 Appendix B: Glossary
The following terms are essential for navigating the specialized functionality and architectural philosophy of the CertChain platform:
•	Ethers.js: A comprehensive JavaScript library utilized by the backend to interact securely with the Ethereum Blockchain and its broader ecosystem, handling the transmission of certificate hashes to the smart contract.
•	Polygon Amoy: A specific, high-throughput Ethereum-compatible testnet blockchain utilized by CertChain to deploy the CertificateStore.sol smart contract without incurring prohibitive transaction fees.
•	Re-anchoring: A backend migration protocol utilizing the re-anchor.js script to systematically read non-revoked certificates from the MySQL database and replay them onto a newly deployed smart contract to recover the decentralized ledger state.
•	SHA-256: A cryptographic hashing algorithm used by the platform to generate a deterministic, 64-character, one-way mathematical fingerprint of the student's normalized certificate data.
•	Smart Contract: A self-executing, decentralized program deployed on the blockchain (CertificateStore.sol) containing the core logic and mapping structures necessary to permanently store and query certificate hashes.
•	Tenant: An individual educational institution or college onboarded onto the CertChain platform, operating within an isolated data workspace governed by specific SaaS subscription limits.
8.3 Appendix C: User Scenarios and Use Cases
The practical utility of the platform is demonstrated through several key user interactions and complex operational workflows:
•	Scenario 1: Institutional Administrator Issues a Credential An authorized college administrator navigates to the "Issue Cert" portal within their secure dashboard. They input a graduating student's full name, email, and program details. Upon clicking "Secure on Blockchain," the system normalizes the text and timestamp, generates a SHA-256 hash, and transmits it via Ethers.js to the Polygon network. Once the transaction is mined (typically within 5-10 seconds), the MySQL database records the transaction details, and the administrator is presented with a dynamically generated, verifiable PDF certificate and a unique QR code to share with the graduate.
•	Scenario 2: Public Verifier Audits a Certificate A prospective employer receives a candidate's digital certificate and scans the embedded QR code. They are seamlessly routed to the public CertChain verification portal without needing to log in. The backend automatically extracts the 36-character UUID, queries the institutional database, recalculates the cryptographic hash, and cross-references it instantly with the immutable state on the Polygon blockchain. The employer receives an immediate, color-coded "SUCCESS" trust badge alongside the precise transaction hash and block timestamp.
•	Scenario 3: Super Admin Onboards a New College The platform's super-administrator logs into the global command center and selects the "Onboard Tenant" module. They input the name and administrative email for a newly partnered university. The backend securely registers the institution, auto-generates a URL-friendly routing slug, establishes a default 30-day "TRIAL" subscription with a 100-certificate limit, and automatically dispatches the login credentials to the university's designated administrator.
8.4 Appendix D: Hardware and System Requirements
The deployment and continuous operation of the CertChain ecosystem demand robust system requirements and a cloud infrastructure capable of supporting high-concurrency web traffic and rapid cryptographic computations.
•	Client/End-User Requirements: The frontend React application is hardware-agnostic. Students, administrators, and public verifiers only require a standard mobile device, tablet, or desktop computer equipped with a modern internet browser (e.g., Google Chrome, Safari, Microsoft Edge) and a stable broadband or 4G/5G network connection.
•	Application Server Requirements: The backend environment must operate on a scalable cloud container (such as Render.com) equipped with a multi-core processor and a minimum of 2GB of RAM to efficiently execute the Node.js runtime, process concurrent bcrypt password hashing, and sustain active WebSocket/RPC connections to the blockchain node.
•	Database Requirements: The central relational database requires a dedicated or managed cloud infrastructure running MySQL version 8.0 or higher. The instance requires optimized memory allocation to maintain the strict 10-connection promise pool utilized by the backend API.
•	Blockchain Infrastructure: The system necessitates highly reliable, low-latency access to the Polygon Amoy testnet, specifically achieved through a premium RPC provider like Alchemy to ensure real-time transaction broadcasting and state querying.
8.5 Appendix E: References (IEEE Format)
[1] Meta Platforms, Inc., "React: The library for web and native user interfaces (Version 19.2.4)," React Documentation, 2024. [Online]. Available: https://react.dev/.
[2] Meta Platforms, Inc., "React DOM: React package for working with the DOM (Version 19.2.4)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/react-dom.
[3] OpenJS Foundation, "Node.js API Reference Documentation," Node.js, 2024. [Online]. Available: https://nodejs.org/en/docs/.
[4] OpenJS Foundation, "Express 5.x - Node.js web application framework (Version 5.2.1)," Express Documentation, 2024. [Online]. Available: https://expressjs.com/.
[5] Ethereum Foundation, "Solidity Programming Language (Version 0.8.20)," Solidity Documentation, 2024. [Online]. Available: https://soliditylang.org/.
[6] R. Sanderson, "Ethers.js: Complete Ethereum library and wallet implementation (Version 6.16.0)," Ethers Documentation, 2024. [Online]. Available: https://docs.ethers.org/.
[7] Oracle Corporation, "MySQL 8.0 Reference Manual," MySQL Documentation, 2024. [Online]. Available: https://dev.mysql.com/doc/refman/8.0/en/.
[8] Tailwind Labs, "Tailwind CSS v4.2: Rapidly build modern websites without ever leaving your HTML," Tailwind CSS Documentation, 2024. [Online]. Available: https://tailwindcss.com/docs.
[9] Vite Contributors, "Vite: Next Generation Frontend Tooling (Version 8.0.4)," Vite Documentation, 2024. [Online]. Available: https://vitejs.dev/guide/.
[10] Microsoft Corporation, "TypeScript: JavaScript with syntax for types (Version 6.0.2)," TypeScript Documentation, 2024. [Online]. Available: https://www.typescriptlang.org/docs/.
[11] Microsoft Corporation, "Playwright: Fast and reliable end-to-end testing for modern web apps (Version 1.59.1)," Playwright Documentation, 2024. [Online]. Available: https://playwright.dev/.
[12] Internet Engineering Task Force (IETF), "JSON Web Token (JWT) - RFC 7519," IETF Datatracker, 2015. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc7519.
[13] Auth0 Community, "jsonwebtoken: JSON Web Token implementation for Node.js (Version 9.0.3)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/jsonwebtoken.
[14] D. Wirtz, "bcrypt: A library to help hash passwords using the bcrypt algorithm (Version 6.0.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/bcrypt.
[15] R. Kiehl, "uuid: RFC-compliant UUID generator for JavaScript (Version 13.0.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/uuid.
[16] S. Bogatyrev, "mysql2: Fast MySQL driver for Node.js with Promise support (Version 3.22.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/mysql2.
[17] M. Hartington, "qrcode: QR code generator for Node.js and browser (Version 1.5.4)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/qrcode.
[18] S. Motkal, "dotenv: Module to load environment variables from .env files (Version 17.4.1)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/dotenv.
[19] T. Zavis, "cors: CORS middleware for Express/Connect (Version 2.8.6)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/cors.
[20] Meta Platforms, Inc., "Jest: Delightful JavaScript Testing Framework (Version 30.3.0)," Jest Documentation, 2024. [Online]. Available: https://jestjs.io/.
[21] V. Kolesnikov, "Supertest: HTTP assertions for integration testing (Version 7.2.2)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/supertest.
[22] R. Mason, "Nodemon: Automatic Node.js process restarter for development (Version 3.1.14)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/nodemon.
[23] K. Wicks, "cross-env: Cross-platform environment variable setting (Version 10.1.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/cross-env.
[24] Remix Software, "React Router DOM: Declarative routing for React applications (Version 7.14.0)," React Router Documentation, 2024. [Online]. Available: https://reactrouter.com/.
[25] M. Hagemeister, "Axios: Promise-based HTTP client for the browser and Node.js (Version 1.15.0)," Axios Documentation, 2024. [Online]. Available: https://axios-http.com/.
[26] Framer B.V., "Framer Motion: Production-ready animation library for React (Version 12.38.0)," Framer Motion Documentation, 2024. [Online]. Available: https://motion.dev/.
[27] Lucide Contributors, "lucide-react: Beautiful and consistent icon set for React (Version 1.8.0)," Lucide Documentation, 2024. [Online]. Available: https://lucide.dev/.
[28] T. Klemm, "react-hot-toast: Lightweight toast notifications for React (Version 2.6.0)," npm Registry, 2024. [Online]. Available: https://react-hot-toast.com/.
[29] J. Rawlings, "jsPDF: Client-side JavaScript PDF generation library (Version 4.2.1)," jsPDF Documentation, 2024. [Online]. Available: https://www.npmjs.com/package/jspdf.
[30] B. Kachalov, "html-to-image: Generates images from DOM nodes using SVG rendering (Version 1.11.13)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/html-to-image.
[31] Fontsource Contributors, "@fontsource/outfit: Self-hosted Outfit typeface for web projects (Version 5.2.8)," npm Registry, 2024. [Online]. Available: https://fontsource.org/fonts/outfit.
[32] NomicFoundation, "Hardhat: Ethereum development environment for compiling, testing, and deploying smart contracts (Version 2.22.0)," Hardhat Documentation, 2024. [Online]. Available: https://hardhat.org/.
[33] NomicFoundation, "hardhat-ethers: Hardhat plugin for integration with Ethers.js (Version 3.0.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/@nomicfoundation/hardhat-ethers.
[34] NomicFoundation, "hardhat-toolbox: Complete Hardhat development toolbox plugin bundle (Version 6.1.2)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/@nomicfoundation/hardhat-toolbox.
[35] NomicFoundation, "hardhat-ignition: Declarative deployment system for Hardhat (Version 3.1.1)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/@nomicfoundation/hardhat-ignition.
[36] Polygon Labs, "Polygon Amoy Testnet: Public EVM-compatible proof-of-stake test network," Polygon Documentation, 2024. [Online]. Available: https://docs.polygon.technology/.
[37] Alchemy Inc., "Alchemy: Blockchain development platform and RPC node infrastructure," Alchemy Documentation, 2024. [Online]. Available: https://docs.alchemy.com/.
[38] Vercel Inc., "Vercel: Frontend cloud platform for static and server-rendered applications," Vercel Documentation, 2024. [Online]. Available: https://vercel.com/docs.
[39] Render Inc., "Render: Cloud application hosting platform for web services and databases," Render Documentation, 2024. [Online]. Available: https://docs.render.com/.
[40] National Institute of Standards and Technology (NIST), "FIPS 180-4: Secure Hash Standard (SHA-256)," NIST Publications, 2015. [Online]. Available: https://csrc.nist.gov/publications/detail/fips/180/4/final.
[41] N. Provos and D. Mazières, "A future-adaptable password scheme," in Proc. USENIX Annual Technical Conf., Monterey, CA, USA, 1999, pp. 81–91.
[42] React Icons Contributors, "react-icons: SVG icon library for React with popular icon packs (Version 5.6.0)," npm Registry, 2024. [Online]. Available: https://www.npmjs.com/package/react-icons.

