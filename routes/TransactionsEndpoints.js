var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')
const {web3} = require('./blockchainConnector');

//Making transactions fom one account to other.
const sendAmountFromOneAccountToOtherRouter=express.Router();
//Getting list of transactions
const getSentFundsTransactionsListByAccountAddressRouter = express.Router();
const getRecievedFundsTransactionsListByAccountAddressRouter = express.Router();
const getPendingTransactionListByAccountAddressRouter = express.Router();
const getMySentFundsTransactionsListFromOtherAccountRouter = express.Router();

module.exports={
    sendAmountFromOneAccountToOtherRouter:sendAmountFromOneAccountToOtherRouter.post("/sendAmountFromOneAccountToOther",(req,resp)=>{
        const {ammount,senderAccountAddress,recieverAccountAddress}=req.body;

        resp.status(200).send({
            responsePlayload:true,
            responseMessage:"Amount: "+ammount+" sent from: "+senderAccountAddress+" to: "+recieverAccountAddress,
            responseCode:807
        })
    }),

    getSentFundsTransactionsListByAccountAddressRouter:getSentFundsTransactionsListByAccountAddressRouter.post("/getSentFundsTransactionsListByAccountAddress",(req,resp)=>{
        const {targetAccountAddress}=req.body;

        var transactionList;
        resp.status(200).send({
            responsePlayload:transactionList,
            responseMessage:"List of your, Mr :"+targetAccountAddress+", spent fund's transactions : "+transactionList,
            responseCode:808
        })
    }),

    getRecievedFundsTransactionsListByAccountAddressRouter:getRecievedFundsTransactionsListByAccountAddressRouter.post("/getRecievedFundsTransactionsListByAccountAddress",(req,resp)=>{
        const {targetAccountAddress}=req.body;

        var transactionList;

        resp.status(200).send({
            responsePlayload:transactionList,
            responseMessage:"List of your, Mr :"+targetAccountAddress+", recieved fund's transactions : "+transactionList,
            responseCode:809
        })
    }),

    getMySentFundsTransactionsListFromOtherAccountRouter:getMySentFundsTransactionsListFromOtherAccountRouter.post("/getMySentFundsTransactionsListFromOtherAccount",(req,resp)=>{
        const {targetAccountAddress,accountToInvestigate}=req.body;

        var transactionList;

        resp.status(200).send({
            responsePlayload:transactionList,
            responseMessage:"List of your,Mr :"+targetAccountAddress+", donation usage transaction from account : "+accountToInvestigate+" is :"+transactionList,
            responseCode:810
        })
    }),
    getPendingTransactionListByAccountAddressRouter:getPendingTransactionListByAccountAddressRouter.post("/getPendingTransactionListByAccountAddress",(req,resp)=>{
        const {targetAccountAddress}=req.body;
        var transactionList;

        resp.status(200).send({
            responsePlayload:transactionList,
            responseMessage:"List of your,Mr :"+targetAccountAddress+", pending transactions "+transactionList,
            responseCode:811
        })
    })
}