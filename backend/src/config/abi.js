const CERTIFICATE_STORE_ABI = [
  "function owner() public view returns (address)",
  "function issueCertificate(string memory _certHash, string memory _institutionId) public",
  "function verifyCertificate(string memory _certHash) public view returns (bool valid, string memory institutionId, uint256 timestamp)",
  "function revokeCertificate(string memory _certHash) public",
  "event CertificateIssued(string indexed certHash, string institutionId, uint256 timestamp)",
  "event CertificateRevoked(string indexed certHash, uint256 timestamp)"
];

module.exports = { CERTIFICATE_STORE_ABI };
