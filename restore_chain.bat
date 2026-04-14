@echo off
echo ====================================================
echo 🚀 CertChain Local Blockchain Restoration Utility
echo ====================================================

echo.
echo [1/2] Deploying Smart Contract to Local Node...
cd blockchain
call npx hardhat run scripts/deploy.js --network localhost

echo.
echo [2/2] Re-anchoring MySQL Database Hashes to Blockchain...
cd ../backend
call node re-anchor.js

echo.
echo ====================================================
echo ✅ Restoration Complete! You can now verify certificates.
echo ====================================================
pause
