const { updateMerkleRoot } = require("./utils");

// for testing only in a fork
const token1 = "0xe725461454e6e0c0349d4f07975EE9980965578c";
const token2 = "0x7E86Ae368D6A25E00A8172fC22C25ECB3A39019E";
const eulerClaims = "0xbFaE9Dc306DCFbdd84894cBb38cBdDfE4C931eFE";

updateMerkleRoot(eulerClaims, token1, token2).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
