// hardhat.config
require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
// const privateKey = fs.readFileSync("./secrets/.privateKey").toString();
const projectId = fs.readFileSync("./secrets/.projectId").toString();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/${projectId}',
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};


// (async () => {
  // const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/");
  // const res = await provider.getBalance('')
  // .then(res => {
  //   return res;
  // })
  // const value = ethers.utils.formatEther(res.toString());
  // console.log(value);
  // await provider.getSigner('').then(res => {
  //   console.log(res);
  // })
  // console.log(provider.getSigner())
  // await provider.listAccounts().then(res => {
  //   console.log(res);
  // })
  // console.log(provider)
  // console.log(provider.listAccounts());
  // const signer = provider.getSigner('');
  // signer.getChainI().then(res => {
  //   console.log(res);
  // })
  // const signer = provider.getSigner('');
  // console.log(signer);
  // const recipient = '';
  // const tx = {
  //   from: '',
  //   to: recipient,
  //   value: ethers.utils.parseUnits("10", "ether"),
  //   gasPrice: gasPrice,
  //   gasLimit: ethers.utils.hexlify(100000),
  //   nounce: provider.getTransactionCount(signer, "latest"),
  // }
  // const transaction = await Signer.sendTransaction(tx);
  // console.log(transaction);
// })();