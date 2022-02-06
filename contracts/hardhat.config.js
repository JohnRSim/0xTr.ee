require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    mumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts: [process.env.TREEPRIVATEKEY,process.env.USER1PRIVATEKEY,],
    },
    hardhat: {
      forking: {
        url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYKEY}`,
      }
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.7.6" },
      { version: "0.6.6" }
    ]
  },
};



