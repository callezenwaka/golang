require("@nomiclabs/hardhat-waffle");
// import fs from "fs";
const fs = require("fs");
const privateKey = fs.readFileSync("./secrets/privateKey").toString();
const projectId = fs.readFileSync("./secrets/projectId").toString();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // localhost: {
  //   url: "http://127.0.0.1:8545"
  // },
  networks: {
    hardhat: {
      chainId: 31337
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};