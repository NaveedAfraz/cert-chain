require("@nomicfoundation/hardhat-ethers");
require("dotenv").config({ path: '../backend/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8546"
    },
    polygonAmoy: {
      url: process.env.ALCHEMY_AMOY_URL || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.OWNER_PRIVATE_KEY ? [process.env.OWNER_PRIVATE_KEY] : []
    }
  }
};
