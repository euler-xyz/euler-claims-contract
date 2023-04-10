const merkleTreeLib = require("../../js/merkle-tree");
const merkleTree = require("../../data/merkle-tree.json");
const fs = require("fs");

let eth = (v) => ethers.utils.parseEther("" + v);

async function updateMerkleRoot(eulerClaimsAddress, token0, token1) {
  const accounts = await hre.ethers.getSigners();

  // create a tree constant that iterates over account0 to account 10
  let tree = Array.from(Array(10).keys()).map((item, idx) => {
    return [
      idx,
      accounts[idx].address,
      [
        idx % 2 === 0
          ? [token0, eth(1 * (idx + 1)).toString()]
          : [token1, eth(1 * (idx + 1)).toString()],
      ],
    ];
  });

  merkleTree.push(...tree);

  newTestMerkleTree = merkleTree.map((item, idx) => {
    return [idx, item[1], item[2]];
  });

  // save this to a new file in ./data/testing-merkle-tree.json
  fs.writeFileSync(
    "./data/testing-merkle-tree.json",
    JSON.stringify(newTestMerkleTree, null, 2)
  );

  let root = merkleTreeLib.root(newTestMerkleTree);
  console.log("root", root);

  const EulerClaims = await hre.ethers.getContractFactory("EulerClaims");
  const eulerClaims = EulerClaims.attach(eulerClaimsAddress);
  await eulerClaims.updateMerkleRoot(root);

  // get the last 6 items from the merkle tree
  tree = newTestMerkleTree.slice(-10);

  for (let i = 0; i < tree.length; i++) {
    let proof = merkleTreeLib.proof(newTestMerkleTree, i);
    // print proof and address to claim
    console.log(
      `address: ${tree[i][1]} proof: ${proof} token: ${tree[i][2][0][0]} amount: ${tree[i][2][0][1]}`
    );
  }
}

module.exports = { updateMerkleRoot, eth };
