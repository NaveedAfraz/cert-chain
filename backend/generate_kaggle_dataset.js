const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const NUM_CERTIFICATES = 120;
const OUTPUT_DIR = path.join(__dirname, 'seed_data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// Simulated IPEDS/Kaggle University Data
const institutionsData = [
  { name: 'Stanford University', state: 'CA', category: 'Private Research', slug: 'stanford-university' },
  { name: 'Massachusetts Institute of Technology', state: 'MA', category: 'Private Research', slug: 'mit' },
  { name: 'University of Michigan', state: 'MI', category: 'Public Research', slug: 'u-michigan' },
  { name: 'University of Texas at Austin', state: 'TX', category: 'Public Research', slug: 'ut-austin' },
  { name: 'Georgia Institute of Technology', state: 'GA', category: 'Public Research', slug: 'georgia-tech' }
];

const courses = [
  'B.S. Computer Science', 'B.A. Economics', 'B.S. Mechanical Engineering',
  'Master of Business Administration', 'Ph.D. Artificial Intelligence',
  'B.S. Data Science', 'M.S. Cybersecurity', 'B.A. History',
  'B.S. Nursing', 'M.S. Software Engineering'
];

const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper', 'Jack', 'Aria', 'Levi', 'Abigail', 'Alexander', 'Emily', 'Jackson', 'Elizabeth', 'Mateo', 'Mila', 'Daniel', 'Ella', 'Michael', 'Avery', 'Mason', 'Sofia', 'Sebastian', 'Camila', 'Ethan', 'Aria'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

function generateUUID() {
  return crypto.randomUUID();
}

// Generate canonical string matching system specs
function generateCertHash(studentName, studentEmail, courseName, timestampStr) {
  // Normalize based on full_doxc.md (Line 274: trim whitespace, lowercase emails)
  const normalizedEmail = studentEmail.trim().toLowerCase();
  const normalizedName = studentName.trim();
  const normalizedCourse = courseName.trim();
  
  const payload = `${normalizedName}|${normalizedEmail}|${normalizedCourse}|${timestampStr}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const institutions = institutionsData.map(inst => ({
  id: generateUUID(),
  ...inst
}));

// Default Platform superadmin & standard users for issuing
const issuerId = generateUUID();

const certificates = [];

for (let i = 0; i < NUM_CERTIFICATES; i++) {
  const institution = institutions[getRandomInt(institutions.length)];
  const course = courses[getRandomInt(courses.length)];
  const firstName = firstNames[getRandomInt(firstNames.length)];
  const lastName = lastNames[getRandomInt(lastNames.length)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(99)}@example.com`;
  const grade = ['3.8 GPA', '3.5 GPA', '4.0 GPA', 'First Class Honors', 'Distinction', 'Pass'][getRandomInt(6)];
  
  // Floor timestamp to nearest second to simulate the system behavior
  // Generate random date within the last 2 years
  const randomTimeOffset = getRandomInt(2 * 365 * 24 * 60 * 60 * 1000);
  const rawDate = Date.now() - randomTimeOffset;
  const flooredTimestamp = Math.floor(rawDate / 1000) * 1000;
  
  const certId = generateUUID();
  const hash = generateCertHash(name, email, course, flooredTimestamp.toString());
  
  certificates.push({
    certificate_id: certId,
    institution_id: institution.id,
    issuer_id: issuerId,
    student_name: name,
    email: email,
    course_name: course,
    grade: grade,
    issue_date: new Date(flooredTimestamp).toISOString().slice(0, 19).replace('T', ' '),
    floored_timestamp: flooredTimestamp.toString(),
    cert_hash: hash,
    status: 'ACTIVE',
    ready_for_blockchain: true
  });
}

// 1. Write CSV for Certificates
const certHeaders = ['certificate_id', 'institution_id', 'issuer_id', 'student_name', 'email', 'course_name', 'grade', 'issue_date', 'cert_hash', 'status', 'ready_for_blockchain'];
let certCsv = certHeaders.join(',') + '\n';
certificates.forEach(c => {
  certCsv += `${c.certificate_id},${c.institution_id},${c.issuer_id},${c.student_name},${c.email},${c.course_name},${c.grade},${c.issue_date},${c.cert_hash},${c.status},${c.ready_for_blockchain}\n`;
});
fs.writeFileSync(path.join(OUTPUT_DIR, 'certificates.csv'), certCsv);

// 2. Write CSV for Institutions
const instHeaders = ['id', 'name', 'slug', 'state', 'category'];
let instCsv = instHeaders.join(',') + '\n';
institutions.forEach(i => {
  instCsv += `${i.id},"${i.name}",${i.slug},${i.state},${i.category}\n`;
});
fs.writeFileSync(path.join(OUTPUT_DIR, 'institutions.csv'), instCsv);

// 3. Write SQL Inserts
let sql = `-- Seed Data Generated for CertChain\n\n`;

// Users
sql += `-- Users (Issuer)\n`;
sql += `INSERT INTO Users (id, full_name, email, password_hash, is_super_admin) VALUES ('${issuerId}', 'System Seed Admin', 'admin@certchain.com', 'seeded_hash', 1);\n\n`;

// Institutions
sql += `-- Institutions\n`;
institutions.forEach(i => {
  sql += `INSERT INTO Institutions (id, name, slug) VALUES ('${i.id}', '${i.name}', '${i.slug}');\n`;
});
sql += `\n`;

// Certificates
sql += `-- Certificates\n`;
certificates.forEach(c => {
  sql += `INSERT INTO Certificates (id, institution_id, issuer_id, student_name, student_email, course_name, cert_hash, is_revoked, issue_date) VALUES ('${c.certificate_id}', '${c.institution_id}', '${c.issuer_id}', '${c.student_name}', '${c.email}', '${c.course_name}', '${c.cert_hash}', 0, '${c.issue_date}');\n`;
});

fs.writeFileSync(path.join(OUTPUT_DIR, 'seed_kaggle_data.sql'), sql);

console.log('Successfully generated CSV and SQL files in backend/seed_data/');
