var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')
const {web3} = require('./blockchainConnector');

var createAccountRouter = express.Router();
var getBalanceByAccountAddressRouter = express.Router();
var getListOfOrganizationRouter=express.Router();

module.exports={ 
    createAccountRouter:createAccountRouter.post("/createAccount",(req,resp)=>{

        const {
            email,password,pin,displayName,address,onlineStatus,photoUrl,
            firstName,lastName,accountType,phoneNumber,description
        } = req.body;

        if(email!=null&&password!=null&&pin!=null)
        {
            web3.eth.personal.newAccount(pin) //!@superpassword
            .then((address)=>{
                //Account created on blockchain
                admin
                .auth() 
                .createUser({
                  email: email,
                  phoneNumber: phoneNumber,
                  password: password,
                  emailVerified: false,
                  displayName: displayName,
                  address:address, 
                  onlineStatus:onlineStatus,
                  photoUrl:photoUrl,
                  disabled: false, 
                })
                .then((userRecord) => {
                    //Account created.
                    // console.log(userRecord)
                    //Now lets sign in.
                    firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        //Sending varification email
                        var user = userCredential.user;
                        var userL = firebase.auth().currentUser;
                          userL.sendEmailVerification().then(function() {
                              //Varification email sent sucessfully.
                              //Now we will create an account on blockchain
                              //will store the account address in realtime database.
                              
                              if(req.body.accountType=="Individual")
                              {
                              //Add in the list of Individual account
                              
                              //Storing over real time database.    
                              const usersRef = ref.child('Users');
                              
                              usersRef.child(user.uid).set({
                                //This will be stored over real time database.
                                firstName:req.body.firstName,
                                lastName:req.body.lastName,
                                userUid:user.uid,
                                email:req.body.email,
                                blockchainAccountAddress:address
                              },(error)=>{
                                  if(error){
                                    console.log("Could not write data on realtime database.")
                                    resp.status(200).send({
                                        responsePayload:null,
                                        responseMessage:"Verification Email Sent, But could not write on the real time database so please contact the support team.",
                                        responseCode:802
                                    }); 
                                  }else{
                                    console.log("Sucessfuly written on realtime database.")
                                    resp.status(200).send({
                                        responsePayload:null,
                                        responseMessage:"Verification Email Sent, Please verify it.",
                                        responseCode:801
                                    }); 
                                  }
                              })

                              }else{
                                  //Add in the list of Organization account
                              
                              //Storing over real time database.    
                              const usersRef = ref.child('Organizations');
                              
                              usersRef.child(user.uid).set({
                                //This will be stored over real time database.
                                description:description,
                                title:displayName,
                                userUid:user.uid,
                                email:req.body.email,
                                blockchainAccountAddress:address
                              },(error)=>{
                                  if(error){
                                    console.log("Could not write data on realtime database.")
                                    resp.status(200).send({
                                        responsePayload:null,
                                        responseMessage:"Verification Email Sent, But could not write on the real time database so please contact the support team.",
                                        responseCode:812
                                    }); 
                                  }else{
                                    console.log("Sucessfuly written on realtime database.")
                                    resp.status(200).send({
                                        responsePayload:null,
                                        responseMessage:"Verification Email Sent, Please verify it.",
                                        responseCode:813
                                    }); 
                                  }
                              })
                              
                              } 
        
                          }).catch((error)=>{
                              //Could not send verification email
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            resp.status(200).send({
                                responsePayload:error,
                                responseMessage:errorMessage,
                                responseCode:errorCode
                            })
                          })
                    }).catch((error)=>{
                        var errorCode = error.code;
                        var errorMessage = error.message;
        
                        resp.status(200).send({
                            responsePayload:error,
                            responseMessage:errorMessage,
                            responseCode:errorCode
                        })
                    })
                    
                }).catch((error)=>{
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    resp.status(200).send({
                            responsePayload:error,
                            responseMessage:errorMessage,
                            responseCode:errorCode
                    })
                })
            }).catch((error)=>{
                console.log(error.message)
                resp.status(200).send({
                    responsePayload:error.message,
                    responseMessage:"Please make sure your block chain node is running.!!",
                    responseCode:816
                }); 
            })
        }

        else{
            resp.status(200).send({
                responsePayload:null,
                responseMessage:"Please provide appropriate email,password and pin.",
                responseCode:806
            });    
        }  

    }),
    getBalanceByAccountAddressRouter:getBalanceByAccountAddressRouter.post("/getBalanceByAccountAddress",(req,resp)=>{
        const {accountAddress}=req.body;
       
        web3.eth.getBalance(accountAddress, (err, wei) => {
           
            console.log(err)
            var balance = web3.utils.fromWei(wei, 'ether');
            resp.status(200).send({
                responsePayload:balance,
                responseMessage:"Account balance with address : "+accountAddress+" is :"+balance,
                responseCode:806
            })
        })

    })
}