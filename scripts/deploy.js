const hre = require("hardhat");
const { updateMerkleRoot, eth } = require("./utils");

async function deploy() {
  const accounts = await hre.ethers.getSigners();
  const signer0 = accounts[0];

  const TestToken = await ethers.getContractFactory("TestToken");
  const tst1 = await TestToken.deploy(ethers.constants.MaxUint256);
  const tst2 = await TestToken.deploy(ethers.constants.MaxUint256);

  await tst1.deployed();
  await tst2.deployed();

  console.log(`TestToken1 deployed to: ${tst1.address}`);
  console.log(`TestToken2 deployed to: ${tst2.address}`);

  const EulerClaims = await hre.ethers.getContractFactory(
    "EulerClaims",
    signer0
  );
  const eulerClaims = await EulerClaims.deploy();
  await eulerClaims.deployed();

  console.log("EulerClaims deployed to:", eulerClaims.address);

  await tst1.transfer(eulerClaims.address, eth(1000));
  await tst2.transfer(eulerClaims.address, eth(1000));

  await updateMerkleRoot(eulerClaims.address, tst1.address, tst2.address);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
