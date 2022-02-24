var express = require("express");
const {firebase,admin,firebaseConfig} = require('./firebaseConnector')

var createAccountRouter = express.Router();

module.exports={ 
    createAccountRouter:createAccountRouter.post("/createAccount",(req,resp)=>{

        admin
        .auth()
        .createUser({
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: req.body.password,
          emailVerified: false,
          displayName: req.body.displayName,
          address:req.body.address, 
          onlineStatus:req.body.onlineStatus,
          photoUrl:req.body.photoUrl,
          blockchainAccountAddress:"",
          disabled: false, 
        })
  
        .then((userRecord) => {
            //Account created.
            console.log(userRecord)
            //Now lets sign in.
            firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
            .then((userCredential) => {
                //Sending varification email
                var user = userCredential.user;
                var userL = firebase.auth().currentUser;
                  userL.sendEmailVerification().then(function() {
                      //Varification email sent sucessfully.
                      
                      //We will create account on block chain after user has verfied email and 
                      //loged in.

                      resp.status(200).send({
                        responsePayload:null,
                        responseMessage:"Verification Email Sent, Please verify it.",
                        responseCode:801
                    }) 
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
    })
}