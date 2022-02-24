var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')

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
            // console.log(userRecord)
            //Now lets sign in.
            firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
            .then((userCredential) => {
                //Sending varification email
                var user = userCredential.user;
                var userL = firebase.auth().currentUser;
                  userL.sendEmailVerification().then(function() {
                      //Varification email sent sucessfully.
                      //Now we will create an account on blockchain
                      //will store the account address in realtime database.
                      
                      if(req.body.accountType=="Individual"){
                          //Add in the list of Individual account
                      const usersRef = ref.child('Users');
                      console.log(user)
                      usersRef.child(user.uid).set({
                        //This will be stored over real time database.
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        userUid:user.uid,
                        emai:req.body.email,
                        blockchainAccountAddress:"-"

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
    })
}