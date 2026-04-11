const { ethers } = require('ethers');
const { CERTIFICATE_STORE_ABI } = require('../config/abi');
require('dotenv').config();

const blockchainUrl = process.env.BLOCKCHAIN_WSS || 'http://127.0.0.1:8545';
let provider, wallet, certificateStoreContract;

if (process.env.NODE_ENV !== 'test') {
    provider = blockchainUrl.startsWith('ws') 
        ? new ethers.WebSocketProvider(blockchainUrl) 
        : new ethers.JsonRpcProvider(blockchainUrl);

    wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    
    const contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    certificateStoreContract = new ethers.Contract(contractAddress, CERTIFICATE_STORE_ABI, wallet);
} else {
    // Dummy objects for tests to overwrite via mocks
    provider = {
        on: () => {},
        removeListener: () => {},
        getNetwork: () => Promise.resolve({ chainId: 31337 })
    };
    wallet = { address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' };
    certificateStoreContract = {
        issueCertificate: () => {
            const txHash = '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
            return Promise.resolve({ 
                hash: txHash,
                wait: () => Promise.resolve({ hash: txHash, blockNumber: 1234 }) 
            });
        },
        verifyCertificate: () => Promise.resolve([true, 'mock_inst_id', 1625097600]),
        revokeCertificate: () => {
            const txHash = '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
            return Promise.resolve({ 
                hash: txHash,
                wait: () => Promise.resolve({ hash: txHash }) 
            });
        }
    };
}

module.exports = {
  provider,
  wallet,
  certificateStoreContract
};
