const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateStore to:", hre.network.name);

  const CertificateStore = await hre.ethers.getContractFactory("CertificateStore");
  const store = await CertificateStore.deploy();

  await store.waitForDeployment();

  const address = await store.getAddress();
  console.log("✅ CertificateStore deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
