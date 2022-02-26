var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')
const {web3} = require('./blockchainConnector');

//Making transactions fom one account to other.
const sendAmountFromOneAccountToOtherRouter=express.Router();
//Getting list of transactions
const getSentRecievedFundsTransactionsListByAccountAddressRouter = express.Router();
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
                        }).catch((error)=>{
                            console.log(error.message)
                            console.log("Error in sending signed transactions..!")
                            resp.status(200).send({
                                responsePlayload:error.message,
                                responseMessage:"Please provide enough gas ammount to process transaction",
                                responseCode:818
                            })
                        }) 

                    }).catch((error)=>{
                        console.log(error.message)
                        console.log("Error in siging transaction")
                    })
            }).catch((error)=>{
                console.log(error.message)
                console.log("Error in unlocking account")
                resp.status(200).send({
                    responsePlayload:error.message,
                    responseMessage:"Plear provide your private key or check the reciver account address to unlock account and process transaction",
                    responseCode:818
                })
            })
        }).catch((error)=>{
            console.log("Error in getting count of transactions aleardy done with this account.")
        })
        
    }),

    getSentRecievedFundsTransactionsListByAccountAddressRouter:getSentRecievedFundsTransactionsListByAccountAddressRouter.post("/getSentRecievedFundsTransactionsListByAccountAddress",(req,resp)=>{
        const {targetAccountAddress}=req.body;
        var sentFundsTransactionList =[];
        var recievedFundsTransactionList =[];
        
        //getting block number so that we can traverse till that block.
        web3.eth.getBlockNumber()
        .then((currentTotalBlocknumber)=>{

            //Getting total transactions done from
            web3.eth.getTransactionCount(targetAccountAddress)
            .then((totalDoneTransactionsByTargetAccount)=>{
                //Now we will traverse the block chain till we have found number 
                //of transactions equal to totalDoneTransactionsByTargetAccount
              
                const traverseBlocks = async ()=>{

                    for(var blockNumber=0;blockNumber<currentTotalBlocknumber;blockNumber++){

                            const c =await web3.eth.getBlock(blockNumber).then((b_detail)=>{
                               
                                if(b_detail.transactions.length>0){
                                    
                                    console.log("Reding  block having transactions")
                                    b_detail.transactions.forEach(function(e) {
                                        web3.eth.getTransaction(e)
                                        .then((transactionReciept)=>{
                                            console.log(transactionReciept)
                                            if(transactionReciept.from.toLowerCase()==targetAccountAddress.toLowerCase())
                                             {
                                                 sentFundsTransactionList.push({
                                                 tranHash:transactionReciept.hash,
                                                 toHash:transactionReciept.to,
                                                 ammount:web3.utils.fromWei(transactionReciept.value, 'ether')
                                                 })
                                            }
                                            if(transactionReciept.to.toLowerCase()==targetAccountAddress.toLowerCase())
                                             {
                                                 recievedFundsTransactionList.push({
                                                 tranHash:transactionReciept.hash,
                                                 fromHash:transactionReciept.from,
                                                 ammount:web3.utils.fromWei(transactionReciept.value, 'ether')
                                                 })
                                            }
                                            
                                        }).catch((error)=>{
                                            console.log(error.message)
                                            console.log("Error in geting transaction details")
                                        })
                                    })
                                }
                            }).catch((error)=>{
                                console.log(error.message)
                                console.log("Error in geting block details")
                            })
                    }

                    resp.status(200).send({
                        responsePlayload:{
                            sentFundsTransactionList:sentFundsTransactionList,
                            recievedFundsTransactionList:recievedFundsTransactionList
                        },
                        responseMessage:"List of your, Mr :"+targetAccountAddress+", spent fund's transactions : "+sentFundsTransactionList+" and recieved fund's transaction list:"+recievedFundsTransactionList,
                        responseCode:808
                    })
                }

                traverseBlocks();
                
            }).catch((error)=>{
                console.log(error.message)
                console.log("Error in count of transactions")
            })
        }).catch((error)=>{
            console.log(error.message)
            console.log("Error in geting block number")
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"Make sure your node is running",
                responseCode:819
            })
        })

        
    }),


   
    getPendingTransactionListByAccountAddressRouter:getPendingTransactionListByAccountAddressRouter.post("/getPendingTransactionListByAccountAddress",(req,resp)=>{
        const {targetAccountAddress}=req.body;
        var transactionList=[];
        //We will return a lis of transaction respective to a account which are pending.
        web3.eth.getPendingTransactions().then((listOfPendingTransactions)=>{
            console.log(listOfPendingTransactions)
            //Access the database to get extra info. after the create a list of transaction which belong the traget account.
            listOfPendingTransactions.forEach((trnas)=>{
                if(trnas.from.toLowerCase()==targetAccountAddress.toLowerCase()){
                    transactionList.push({
                        toHash:trnas.to,
                        transactionHash:trnas.hash,
                        account:web3.utils.fromWei(trnas.value, 'ether')
                    })
                }
            })
            resp.status(200).send({
                responsePlayload:transactionList,
                responseMessage:"List of your,Mr :"+targetAccountAddress+", pending transactions "+transactionList,
                responseCode:811
            })
        }).catch((error)=>{
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"Please make sure you node is running or your provide hash is correct. For futher details watch message payload.",
                responseCode:820
            }) 
        })
    }),   
}
