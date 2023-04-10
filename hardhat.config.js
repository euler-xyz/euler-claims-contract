const { env } = require("./env");

require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    remoteRPC: {
      url: env().REMOTE_RPC_URL,
      chainId: 1337,
      gas: 9000000,
      gasPrice: 10e9,
      timeout: 99999999,
      accounts: { mnemonic: env().TEST_MNEMONIC },
    },
  },
};
