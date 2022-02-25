var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')
const {web3} = require('./blockchainConnector');

const deployContractRouter = express.Router();
const storeDataOnBlockchain = express.Router();
const getDataFromBlockchain = express.Router();

// module.exports={
//     storeDataOnBlockchain
// }