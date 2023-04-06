const fs = require('fs');
const ethers = require('ethers');

let terms = fs.readFileSync('./terms-and-conditions.txt');
let hash = ethers.utils.keccak256(terms);
console.log(hash);
