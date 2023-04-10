const hre = require("hardhat");
const merkleTree = require("../js/merkle-tree");

let eth = (v) => ethers.utils.parseEther("" + v);

async function deploy() {
  const accounts = await hre.ethers.getSigners();
  const signer0 = accounts[0];

  const TestToken = await ethers.getContractFactory("TestToken");
  const tst1 = await TestToken.deploy(ethers.constants.MaxUint256);
  const tst2 = await TestToken.deploy(ethers.constants.MaxUint256);

  await tst1.deployed();
  await tst2.deployed();

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

async function updateMerkleRoot(eulerClaimsAddress, token0, token1) {
  const accounts = await hre.ethers.getSigners();

  const account0 = accounts[0].address;
  const account1 = accounts[1].address;
  const account2 = accounts[2].address;

  let tree = [
    [0, account0, [[token0, eth(1)]]],
    [1, account1, [[token0, eth(2)]]],
    [2, account2, [[token0, eth(3)]]],
    [3, account0, [[token1, eth(4)]]],
    [4, account1, [[token1, eth(5)]]],
    [5, account2, [[token1, eth(6)]]],
  ];

  let root = merkleTree.root(tree);
  console.log("root", root);

  const EulerClaims = await hre.ethers.getContractFactory("EulerClaims");
  const eulerClaims = EulerClaims.attach(eulerClaimsAddress);
  await eulerClaims.updateMerkleRoot(root);

  for (let i = 0; i < tree.length; i++) {
    let proof = merkleTree.proof(tree, i);
    // print proof and address to claim
    console.log(
      `address: ${tree[i][1]} proof: ${proof} token: ${tree[i][2][0][0]} amount: ${tree[i][2][0][1]}`
    );
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
