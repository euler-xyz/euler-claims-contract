const hre = require("hardhat");

async function main() {
  const EulerClaims = await hre.ethers.getContractFactory("EulerClaims");
  const eulerClaims = await EulerClaims.deploy();

  await eulerClaims.deployed();

  console.log(`EulerClaims deployed to ${eulerClaims.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
