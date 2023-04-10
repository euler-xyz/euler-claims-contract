const { updateMerkleRoot } = require("./utils");

// for testing only in a fork
const token1 = "0x93Bd0C3A707D1330cCfB3969d9F415F5891bE15b";
const token2 = "0x2cc2c326323435438F1Fb7b636C14DEf255b40A2";
const eulerClaims = "0x0957CE357ee5a734e9C00Bca53Ae90123b50DCb8";

updateMerkleRoot(eulerClaims, token1, token2).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
