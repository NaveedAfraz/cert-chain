const crypto = require('crypto');

/**
 * Generates a SHA-256 hash for a given data object
 * @param {Object} data 
 * @returns {string} The hash
 */
function generateCertHash(studentEmail, studentName, courseName, issueDate) {
    // 1. Strict normalization: Trim whitespace and handle casing consistently if needed
    const email = studentEmail.trim().toLowerCase();
    const name = studentName.trim();
    const course = courseName.trim();

    // 2. Date normalization: Ensure we get a consistent UTC timestamp (seconds)
    // This removes millisecond jitter and timezone shifts
    const normalizedTime = Math.floor(new Date(issueDate).getTime() / 1000) * 1000;
    
    const rawData = `${email}|${name}|${course}|${normalizedTime}`;
    console.log(`[HASHING] Raw: ${rawData}`);
    return crypto.createHash('sha256').update(rawData).digest('hex');
}

module.exports = { generateCertHash };
