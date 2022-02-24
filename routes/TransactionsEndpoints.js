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
        const {ammount,senderAccountAddress,senderAccountPin,recieverAccountAddress,gasPrice,gasLimit}=req.body;
        web3.eth.getTransactionCount(senderAccountAddress, (err, txCount) => {
            //Got the transaction count.
            //unlocking account
             web3.eth.personal.unlockAccount(senderAccountAddress,senderAccountPin, 5000)
             .then(()=>{
                 //signing a transaction
                web3.eth.signTransaction({
                  nonce:  web3.utils.toHex(txCount),
                  from : senderAccountAddress,
                  to:      recieverAccountAddress,
                  value:    web3.utils.toHex(web3.utils.toWei(ammount, 'ether')),
                  gasLimit: web3.utils.toHex(gasLimit),
                  gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei'))
                },senderAccountPin).then((signedTransaction)=>{
                //Sending signed transaction
                        // console.log(signedTransaction.tx)
                        web3.eth.personal.sendTransaction({
                            // nonce:    signedTransaction.tx.nonce,
                            from : senderAccountAddress,
                            to:       signedTransaction.tx.to,
                            value:    signedTransaction.tx.value,
                            gasLimit: signedTransaction.tx.gasLimit,
                            gasPrice: signedTransaction.tx.gasPrice,
                            maxPriorityFeePerGas: signedTransaction.tx.maxPriorityFeePerGas,
                            maxFeePerGas: signedTransaction.tx.maxFeePerGas,
                            gas: signedTransaction.tx.gas,
                            input: signedTransaction.tx.input,
                            v: signedTransaction.tx.input,
                            r:
                            signedTransaction.tx.r,
                            s:
                            signedTransaction.tx.s,
                            hash:
                            signedTransaction.tx.hash
                        },senderAccountPin).then((txtHash)=>{
                            resp.status(200).send({
                                responsePlayload:true,
                                responseMessage:"Amount: "+ammount+" sent from: "+senderAccountAddress+" to: "+recieverAccountAddress+" Since transaction hash is : "+txtHash,
                                responseCode:807
                            })
                        }); 

                    })
            })
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