const { config } = require("dotenv");
const { str, cleanEnv } = require("envalid");

config();

const envValidation = {
  TEST_MNEMONIC: str({
    default: "test test test test test test test test test test test junk",
    desc: "The mnemonic for the account to use for testing",
    docs: "info: Please set TEST_MNEMONIC as env variable",
  }),
  REMOTE_RPC_URL: str({
    default: "http://localhost:8545",
    desc: "The URL for the remote RPC",
    docs: "info: Please set REMOTE_RPC_URL as env variable",
  }),
};

const env = () => cleanEnv(process.env, envValidation);

module.exports = {
  env,
};
