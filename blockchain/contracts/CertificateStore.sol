// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SaaS CertificateStore
 * @dev Stores certificate proofs for multiple institutions in a shared ledger.
 */
contract CertificateStore {
    address public owner;

    struct CertificateRecord {
        string institutionId;
        uint256 timestamp;
        bool isValid;
    }

    // Mapping from certHash (SHA256) to its record
    mapping(string => CertificateRecord) private certificates;

    event CertificateIssued(string indexed certHash, string institutionId, uint256 timestamp);
    event CertificateRevoked(string indexed certHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Issues a certificate proof on blockchain.
     * @param _certHash The cryptographic fingerprint of the certificate.
     * @param _institutionId The UUID of the issuing college/EdTech.
     */
    function issueCertificate(string memory _certHash, string memory _institutionId) public onlyOwner {
        require(certificates[_certHash].timestamp == 0, "Hash already exists on chain");
        
        certificates[_certHash] = CertificateRecord({
            institutionId: _institutionId,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(_certHash, _institutionId, block.timestamp);
    }

    /**
     * @dev Verifies a certificate publicly.
     * @param _certHash The fingerprint to check.
     */
    function verifyCertificate(string memory _certHash) public view returns (bool valid, string memory institutionId, uint256 timestamp) {
        CertificateRecord memory cert = certificates[_certHash];
        return (cert.isValid && cert.timestamp != 0, cert.institutionId, cert.timestamp);
    }

    /**
     * @dev Revokes a certificate by its hash.
     */
    function revokeCertificate(string memory _certHash) public onlyOwner {
        require(certificates[_certHash].timestamp != 0, "Certificate record not found");
        certificates[_certHash].isValid = false;
        emit CertificateRevoked(_certHash, block.timestamp);
    }
}
