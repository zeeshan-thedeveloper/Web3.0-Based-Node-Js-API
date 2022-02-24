const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Geth RPC is working.

module.exports={
    web3:web3
}