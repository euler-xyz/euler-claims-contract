const { time, loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const fs = require('fs');
const merkleTree = require("../js/merkle-tree.js");

describe("EulerClaims", function () {
    let eth = (v) => ethers.utils.parseEther('' + v);

    const termsAndConditionsHash = ethers.utils.keccak256(fs.readFileSync('./terms-and-conditions.txt'));
    let acceptTerms = (w) => ethers.utils.keccak256(ethers.utils.concat([w.address, termsAndConditionsHash]));

    async function deployClaims() {
        const [owner, wallet1, wallet2] = await ethers.getSigners();

        const EulerClaims = await ethers.getContractFactory("EulerClaims");
        const eulerClaims = await EulerClaims.deploy(owner.address);

        const TestToken = await ethers.getContractFactory("TestToken");
        const tst1 = await TestToken.deploy(ethers.constants.MaxUint256);
        const tst2 = await TestToken.deploy(ethers.constants.MaxUint256);

        return { eulerClaims, tst1, tst2, owner, wallet1, wallet2, };
    }


    describe("Accessors", function () {
        it("Accessors", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(1)]]],
                [1, wallet2.address, [[tst1.address, eth(2)]]],
                [2, wallet2.address, [[tst1.address, eth(3)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);

            expect(await eulerClaims.name()).to.equal("Euler Claims");
            expect(await eulerClaims.owner()).to.equal(owner.address);
            expect(await eulerClaims.merkleRoot()).to.equal(root);

            // You have to get this from the contract source code
            expect(eulerClaims.termsAndConditionsHash).to.equal(undefined);
        });
    });


    describe("Basic claims", function () {
        it("Single, small tree", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(20)]]],
                [1, wallet2.address, [[tst1.address, eth(9000)]]],
                [2, wallet2.address, [[tst1.address, eth(9001)]]],
                [3, wallet2.address, [[tst1.address, eth(9002)]]],
                [4, wallet2.address, [[tst1.address, eth(9003)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);

            await tst1.transfer(eulerClaims.address, eth(20));

            let proof = merkleTree.proof(tree, 0);

            expect(await eulerClaims.alreadyClaimed(0)).to.equal(false);

            await eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), 0, tree[0][2], proof);
            expect(await tst1.balanceOf(wallet1.address)).to.equal(eth(20));

            expect(await eulerClaims.alreadyClaimed(0)).to.equal(true);

            // Try to submit same claim again
            await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), 0, tree[0][2], proof))
                    .to.be.revertedWith('already claimed');
        });

        it("Multiple, larger tree", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [];
            let totalAmount = eth(0);

            for (let i = 0; i < 1000; i++) {
                let amount = eth(i + 1);
                totalAmount = totalAmount.add(amount);
                tree.push([i, wallet1.address, [[tst1.address, amount]]]);
            }

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);

            await tst1.transfer(eulerClaims.address, totalAmount);

            let doClaim = async (i) => {
                let proof = merkleTree.proof(tree, i);

                await eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), i, tree[i][2], proof);

                // Try to submit same claim again
                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), i, tree[i][2], proof))
                        .to.be.revertedWith('already claimed');
            };

            for (let i of [0,999,321,89,912,700,2]) {
                await doClaim(i);
            }
        });

        it("Multi-tokens", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(20)]]],
                [1, wallet1.address, [[tst1.address, eth(9000)]]],
                [2, wallet1.address, [[tst1.address, eth(500)], [tst2.address, eth(.001)]]],
                [3, wallet2.address, [[tst2.address, eth(100)], [tst1.address, eth(20)]]],
                [4, wallet2.address, [[tst1.address, eth(9003)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);

            await tst1.transfer(eulerClaims.address, eth(1000));
            await tst2.transfer(eulerClaims.address, eth(1000));

            {
                let n = 2;
                await eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), n, tree[n][2], merkleTree.proof(tree, n));

                expect(await tst1.balanceOf(wallet1.address)).to.equal(eth(500));
                expect(await tst2.balanceOf(wallet1.address)).to.equal(eth(.001));
            }

            {
                let n = 3;
                await eulerClaims.connect(wallet2).claimAndAgreeToTerms(acceptTerms(wallet2), n, tree[n][2], merkleTree.proof(tree, n));

                expect(await tst1.balanceOf(wallet2.address)).to.equal(eth(20));
                expect(await tst2.balanceOf(wallet2.address)).to.equal(eth(100));
            }
        });
    });


    describe("Failure cases", function () {
        it("Failure cases", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(20)]]],
                [1, wallet1.address, [[tst1.address, eth(9000)]]],
                [2, wallet1.address, [[tst1.address, eth(500)], [tst2.address, eth(.001)]]],
                [3, wallet1.address, [[tst2.address, eth(100)], [tst1.address, eth(20)]]],
                [4, wallet1.address, [[tst1.address, eth(9003)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);

            await tst1.transfer(eulerClaims.address, eth(1000));
            await tst2.transfer(eulerClaims.address, eth(1000));

            // Incorrect wallet

            {
                let n = 2;
                await expect(eulerClaims.connect(wallet2).claimAndAgreeToTerms(acceptTerms(wallet2), n, tree[n][2], merkleTree.proof(tree, n)))
                    .to.be.revertedWith('proof invalid');
            }

            // Using wrong proof

            {
                let n = 2;
                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), n, tree[n][2], merkleTree.proof(tree, 3)))
                    .to.be.revertedWith('proof invalid');

                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), n, tree[n][2], []))
                    .to.be.revertedWith('proof invalid');
            }

            // Wrong index

            {
                let n = 2;
                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), 0, tree[n][2], merkleTree.proof(tree, n)))
                    .to.be.revertedWith('proof invalid');
            }

            // Changing TokenAmount payload

            {
                let n = 2;
                let payload = [ [...tree[n][2][0]], [...tree[n][2][1]] ];
                payload[0][1] = payload[0][1].add(1);
                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet1), n, payload, merkleTree.proof(tree, n)))
                    .to.be.revertedWith('proof invalid');
            }

            // Bad terms and conditions token

            {
                let n = 2;

                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(acceptTerms(wallet2), n, tree[n][2], merkleTree.proof(tree, n)))
                    .to.be.revertedWith('please read the terms and conditions');

                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(termsAndConditionsHash, n, tree[n][2], merkleTree.proof(tree, n)))
                    .to.be.revertedWith('please read the terms and conditions');

                await expect(eulerClaims.connect(wallet1).claimAndAgreeToTerms(ethers.constants.HashZero, n, tree[n][2], merkleTree.proof(tree, n)))
                    .to.be.revertedWith('please read the terms and conditions');
            }
        });
    });


    describe("Owner Functions", function () {
        it("Update Merkle root", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(1)]]],
                [1, wallet2.address, [[tst1.address, eth(2)]]],
                [2, wallet1.address, [[tst1.address, eth(3)]]],
                [3, wallet2.address, [[tst1.address, eth(4)]]],
                [4, wallet1.address, [[tst1.address, eth(5)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);
            await tst1.transfer(eulerClaims.address, eth(1000));

            expect(await eulerClaims.merkleRoot()).to.equal(root);

            tree.push([5, wallet2.address, [[tst1.address, eth(6)]]]);

            let n = 5;

            await expect(eulerClaims.connect(wallet2).claimAndAgreeToTerms(acceptTerms(wallet2), n, tree[n][2], merkleTree.proof(tree, n)))
                .to.be.revertedWith('proof invalid');

            // Update root

            let newRoot = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(newRoot);

            await eulerClaims.connect(wallet2).claimAndAgreeToTerms(acceptTerms(wallet2), n, tree[n][2], merkleTree.proof(tree, n));

            // Non-owner cannot change root

            await expect(eulerClaims.connect(wallet1).updateMerkleRoot(root))
                .to.be.revertedWith('unauthorized');
        });


        it("Change owner", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            expect(await eulerClaims.owner()).to.equal(owner.address);

            await expect(eulerClaims.connect(wallet1).transferOwnership(wallet1.address))
                .to.be.revertedWith('unauthorized');

            await eulerClaims.transferOwnership(wallet1.address);

            expect(await eulerClaims.owner()).to.equal(wallet1.address);

            await expect(eulerClaims.transferOwnership(wallet2.address))
                .to.be.revertedWith('unauthorized');
        });


        it("Recover funds", async function () {
            const { eulerClaims, owner, tst1, tst2, wallet1, wallet2, } = await loadFixture(deployClaims);

            let tree = [
                [0, wallet1.address, [[tst1.address, eth(1)]]],
                [1, wallet2.address, [[tst1.address, eth(2)]]],
                [2, wallet1.address, [[tst1.address, eth(3)]]],
                [3, wallet2.address, [[tst1.address, eth(4)]]],
                [4, wallet1.address, [[tst1.address, eth(5)]]],
            ];

            let root = merkleTree.root(tree);
            await eulerClaims.updateMerkleRoot(root);
            await tst1.transfer(eulerClaims.address, eth(1000));
            await tst2.transfer(eulerClaims.address, eth(50));

            // Only owner

            await expect(eulerClaims.connect(wallet1).recoverFunds([], [[tst1.address, eth(200)]]))
                .to.be.revertedWith('unauthorized');

            // Simple recovery without invalidating any index

            expect(await tst1.balanceOf(eulerClaims.address)).to.equal(eth(1000));
            let origOwnerBal = await tst1.balanceOf(owner.address);

            await eulerClaims.recoverFunds([], [[tst1.address, eth(200)]]);

            expect(await tst1.balanceOf(eulerClaims.address)).to.equal(eth(800));
            expect(await tst1.balanceOf(owner.address)).to.equal(origOwnerBal.add(eth(200)));

            // Multiple tokens

            await eulerClaims.recoverFunds([], [[tst1.address, eth(200)], [tst2.address, eth(10)]]);

            expect(await tst1.balanceOf(eulerClaims.address)).to.equal(eth(600));
            expect(await tst2.balanceOf(eulerClaims.address)).to.equal(eth(40));

            // Invalidate indices

            expect(await eulerClaims.alreadyClaimed(0)).to.equal(false);
            expect(await eulerClaims.alreadyClaimed(1)).to.equal(false);
            expect(await eulerClaims.alreadyClaimed(3)).to.equal(false);

            await eulerClaims.recoverFunds([1, 3], [[tst1.address, eth(2 + 4)]]);

            expect(await eulerClaims.alreadyClaimed(0)).to.equal(false);
            expect(await eulerClaims.alreadyClaimed(1)).to.equal(true);
            expect(await eulerClaims.alreadyClaimed(3)).to.equal(true);

            // Already claimed

            await expect(eulerClaims.recoverFunds([1, 3], [[tst1.address, eth(2 + 4)]]))
                .to.be.revertedWith('already claimed');
        });
    });
});
