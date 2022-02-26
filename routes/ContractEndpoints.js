var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')
const {web3} = require('./blockchainConnector');

const deployContractRouter = express.Router();
const storeDataOnBlockchainRouter = express.Router();
const getDataFromBlockchainRotuer = express.Router();
let contractABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"recordsList","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"retrieve","outputs":[{"internalType":"string","name":"val","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"nameVal","type":"string"}],"name":"store","outputs":[{"internalType":"string","name":"responseMessage","type":"string"}],"stateMutability":"nonpayable","type":"function"}];
const  data ='0x6080604052600060035534801561001557600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506107b2806100666000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063131a0680146100465780638f88708b14610076578063e8d7873e146100a6575b600080fd5b610060600480360381019061005b9190610478565b6100d6565b60405161006d9190610527565b60405180910390f35b610090600480360381019061008b91906104c1565b6101b1565b60405161009d9190610527565b60405180910390f35b6100c060048036038101906100bb91906104c1565b6102b0565b6040516100cd9190610527565b60405180910390f35b6060600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461013257600080fd5b81600260006003548152602001908152602001600020908051906020019061015b929190610350565b506003600081548092919061016f9061066a565b91905055506040518060400160405280600c81526020017f53746f7265642076616c756500000000000000000000000000000000000000008152509050919050565b6060600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461020d57600080fd5b60026000838152602001908152602001600020805461022b90610607565b80601f016020809104026020016040519081016040528092919081815260200182805461025790610607565b80156102a45780601f10610279576101008083540402835291602001916102a4565b820191906000526020600020905b81548152906001019060200180831161028757829003601f168201915b50505050509050919050565b600260205280600052604060002060009150905080546102cf90610607565b80601f01602080910402602001604051908101604052809291908181526020018280546102fb90610607565b80156103485780601f1061031d57610100808354040283529160200191610348565b820191906000526020600020905b81548152906001019060200180831161032b57829003601f168201915b505050505081565b82805461035c90610607565b90600052602060002090601f01602090048101928261037e57600085556103c5565b82601f1061039757805160ff19168380011785556103c5565b828001600101855582156103c5579182015b828111156103c45782518255916020019190600101906103a9565b5b5090506103d291906103d6565b5090565b5b808211156103ef5760008160009055506001016103d7565b5090565b60006104066104018461056e565b610549565b90508281526020810184848401111561042257610421610745565b5b61042d8482856105c5565b509392505050565b600082601f83011261044a57610449610740565b5b813561045a8482602086016103f3565b91505092915050565b60008135905061047281610765565b92915050565b60006020828403121561048e5761048d61074f565b5b600082013567ffffffffffffffff8111156104ac576104ab61074a565b5b6104b884828501610435565b91505092915050565b6000602082840312156104d7576104d661074f565b5b60006104e584828501610463565b91505092915050565b60006104f98261059f565b61050381856105aa565b93506105138185602086016105d4565b61051c81610754565b840191505092915050565b6000602082019050818103600083015261054181846104ee565b905092915050565b6000610553610564565b905061055f8282610639565b919050565b6000604051905090565b600067ffffffffffffffff82111561058957610588610711565b5b61059282610754565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b6000819050919050565b82818337600083830152505050565b60005b838110156105f25780820151818401526020810190506105d7565b83811115610601576000848401525b50505050565b6000600282049050600182168061061f57607f821691505b60208210811415610633576106326106e2565b5b50919050565b61064282610754565b810181811067ffffffffffffffff8211171561066157610660610711565b5b80604052505050565b6000610675826105bb565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156106a8576106a76106b3565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61076e816105bb565b811461077957600080fd5b5056fea26469706673582212202ccee7681dfd0c1dddccae756e8111e7fbd5a56d3ce8a020e5b00763430acf8564736f6c63430008070033';
module.exports={
    deployContractRouter:deployContractRouter.post("/deployContract",(req,resp)=>{
        const {deployingAccountAddress,deployingAccountPin,userUid} = req.body; 
        web3.eth.personal.unlockAccount(deployingAccountAddress,deployingAccountPin, 3000)
        .then(()=>{
            console.log("Account :"+deployingAccountAddress+" unlocked");
            var checkoutfuntionsContract = new web3.eth.Contract(contractABI);
            var checkoutfuntions = checkoutfuntionsContract.deploy({
             data: data, 
             arguments: []
            }).send({
                from: deployingAccountAddress, 
                gas: '4700000'
            }, function (e, contract){
            // console.log(e, contract);
            }).on('error', function(error){ 
            console.log(error.message)
            console.log("Error in deploying contract")
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"For futher details watch message payload",
                responseCode:822
            })
            }).on('transactionHash', function(transactionHash){
            //   console.log(transactionHash)
            })
            .on('receipt', function(contractLocatingAddress){
             console.log(contractLocatingAddress) // contains the new contract address
                //Now we will save its address to firebase real time database.
                            const usersRef = ref.child('Contracts');
                            usersRef.child(userUid).set({
                                //This will be stored over real time database.
                                blockchainAccountAddress:deployingAccountAddress,
                                contractAddress:contractLocatingAddress.contractAddress
                              },(error)=>{
                                console.log(error)
                            })

                            resp.status(200).send({
                                responsePlayload:{
                                    userUid:userUid,
                                    blockchainAccountAddress:deployingAccountAddress,
                                    contractAddress:contractLocatingAddress.contractAddress,
                                    contractFullDetails:contractLocatingAddress
                                },
                                responseMessage:"Contract deployed sucessfully",
                                responseCode:812
                            })
            })
        }).catch((error)=>{
            console.log(error.message)
            console.log("Error in unlocking account")
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"Please make sure your node is running or the key you have provided is correct, for futher details watch message payload",
                responseCode:821 
            })
        })
    }),

    storeDataOnBlockchainRouter:storeDataOnBlockchainRouter.post("/storeDataOnBlockchain",(req,resp)=>{
        const {dataToStore,requestingAccountAddress,requestingAccountPin,contractAddress} = req.body;
        web3.eth.personal.unlockAccount(requestingAccountAddress,requestingAccountPin, 5000)
        .then(()=>{
            console.log("Account "+requestingAccountAddress+" unlocked")
            const contract = new web3.eth.Contract(contractABI,contractAddress);
            contract.methods.store(dataToStore).send({from: requestingAccountAddress}).then((result)=>{ //Note we use send method when we have to update the blockchain state.
                console.log(result)
                resp.status(200).send({
                    responsePlayload:true,
                    responseMessage:"Data : "+dataToStore+" stored on block chain sucessfully with account address :"+requestingAccountAddress+" Response is :"+result,
                    responseCode:813 
                })
            }).catch((error)=>{
                resp.status(200).send({
                    responsePlayload:error.message,
                    responseMessage:"We can store data with contract, with address :"+contractAddress+" can be accessed with its owner only",
                    responseCode:816
                })
            })
        }).catch((error)=>{
            console.log(error.message)
            console.log("Error in unlocking account")
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"Please make sure your node is running or the key you have provided is correct, for futher details watch message payload",
                responseCode:821 
            })
        })
    }),

    getDataFromBlockchainRotuer:getDataFromBlockchainRotuer.post("/getDataFromBlockchain",(req,resp)=>{
        const {keyToFindData,dataFetchRequestingAccountAddress,dataFetchRequestingAccountPin,contractAddress}=req.body;
        
        web3.eth.personal.unlockAccount(dataFetchRequestingAccountAddress,dataFetchRequestingAccountPin, 5000)
        .then(()=>{
            console.log("Account :"+dataFetchRequestingAccountAddress+" unclocked")
            const contract = new web3.eth.Contract(contractABI,contractAddress);
            contract.methods.retrieve(keyToFindData).call({from: dataFetchRequestingAccountAddress}).then((result)=>{
                console.log(result)
                resp.status(200).send({
                    responsePlayload:result,
                    responseMessage:"Data : Fetch"+result+" for Mr:"+dataFetchRequestingAccountAddress+" and data is:"+result,
                    responseCode:814
                })
            }).catch((error)=>{
                resp.status(200).send({
                    responsePlayload:error.message,
                    responseMessage:"We can access data from contract, with address :"+contractAddress+" can be accessed with its owner only",
                    responseCode:815
                })
            })
        }).catch((error)=>{
            console.log(error.message)
            console.log("Error in unlocking account")
            resp.status(200).send({
                responsePlayload:error.message,
                responseMessage:"Please make sure your node is running or the key you have provided is correct, for futher details watch message payload",
                responseCode:821 
            })
        })
       
        
    })
}