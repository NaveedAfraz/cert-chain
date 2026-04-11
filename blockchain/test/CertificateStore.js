const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateStore", function () {
  let CertificateStore, store, owner, addr1;

  beforeEach(async function () {
    CertificateStore = await ethers.getContractFactory("CertificateStore");
    [owner, addr1] = await ethers.getSigners();
    store = await CertificateStore.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await store.owner()).to.equal(owner.address);
  });

  it("Should issue a certificate successfully", async function () {
    const certHash = "0x123abc";
    await store.issueCertificate(certHash);
    expect(await store.verifyCertificate(certHash)).to.equal(true);
  });

  it("Should fail if non-owner tries to issue", async function () {
    const certHash = "0x123abc";
    await expect(
      store.connect(addr1).issueCertificate(certHash)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should revoke a certificate", async function () {
    const certHash = "0x123abc";
    await store.issueCertificate(certHash);
    await store.revokeCertificate(certHash);
    expect(await store.verifyCertificate(certHash)).to.equal(false);
  });
});
