import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertificateStoreModule", (m) => {
  const store = m.contract("CertificateStore");

  return { store };
});
