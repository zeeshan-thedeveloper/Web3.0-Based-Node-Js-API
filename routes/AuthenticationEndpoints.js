var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')

var signInRouter = express.Router();

module.exports={
    signInRouter:signInRouter.post("/signIn",(req,resp)=>{

            //we will login to firebase account.
         
        if(req.body.email!=null && req.body.password!=null)  
        {
            firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
            .then((userCredential) => {
                //Login sucessful.
                //Now check if email is verified or not.
                var user = userCredential.user;
                if(user.emailVerified)
                {
                    resp.status(200).send({
                        responsePayload:userCredential,
                        responseMessage:"Login sucessful",
                        responseCode:804
                    })
                }else{
                    resp.status(200).send({
                        responsePayload:null,
                        responseMessage:"Please first verifiy the email.!",
                        responseCode:805
                    })
                }
            }).catch((error)=>{
                var errorCode = error.code;
                var errorMessage = error.message;
                resp.status(200).send({
                    responsePayload:error,
                    responseMessage:errorMessage,
                    responseCode:errorCode
                })
            })

        }else{
            resp.status(200).send({
                responsePayload:null,
                responseMessage:"Please fill the email and password properly",
                responseCode:802
            })
        }    
       
    }),
}
