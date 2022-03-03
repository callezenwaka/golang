require("@nomiclabs/hardhat-waffle");
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
      url: `https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};