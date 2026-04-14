const promisePool = require('./src/config/db');
const { generateCertHash } = require('./src/utils/hash');

async function fixHashesZ() {
  try {
    const [certs] = await promisePool.query("SELECT * FROM Certificates");
    
    let updated = 0;
    for (const cert of certs) {
      const correctHash = generateCertHash(cert.student_email, cert.student_name, cert.course_name, cert.issue_date);
      
      if (cert.cert_hash !== correctHash) {
        await promisePool.query("UPDATE Certificates SET cert_hash = ? WHERE id = ?", [correctHash, cert.id]);
        updated++;
      }
    }
    
    console.log(`Successfully fixed ${updated} certificate hashes with correct TZ 'Z'`);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fixHashesZ();
