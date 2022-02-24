var express = require("express");
const {firebase,admin,ref} = require('./firebaseConnector')

var signInRouter = express.Router();

module.exports={
    signInRouter:signInRouter.post("/signIn",(req,resp)=>{

            //we will login to firebase account.
        const {email,password,accountType} = req.body;
            
        if(email!=null && password!=null)  
        {
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                //Login sucessful.
                //Now check if email is verified or not.
                var user = userCredential.user;
                if(user.emailVerified)
                {
                    //Now we will access the realtime database and will fetch data to be used in front end.
                    console.log("User uid :"+user.uid)

                    if(accountType=="Individual"){
                        //If account is of individul.
                        ref.child("Users").child(user.uid).once('value', (snapshot) => {
                            // do some stuff once
                            const storedValue=[];
                            snapshot.forEach((data)=>{storedValue.push(data.val())})
                            storedValue[5]=userCredential.user.email;
                            
                            // console.log(storedValue)
                            // [ '0xCb4AA5405AaD1Fb5afc10E5CF37c33623ECF0933',
                            //   'zeeshanahmedd0010@gmail.com',
                            //    'Zeeshan',
                            //    'Ahmed',
                            //    'aoSuplepeRNLiqrL2wPrMtI3Mm43' ]
    
                            const dataToSend={
                                blockchainAccountAddress: storedValue[0],
                                email: storedValue[1],
                                firstName: storedValue[2],
                                lastName: storedValue[3],
                                userUid: storedValue[4],
                                email:storedValue[5]
                            }
                            resp.status(200).send({
                                responsePayload:dataToSend,
                                responseMessage:"Login sucessful",
                                responseCode:804
                            })
                        });
    
                    }else{
                        //If organizations type of account is.
                        ref.child("Organizations").child(user.uid).once('value', (snapshot) => {
                            // do some stuff once
                            const storedValue=[];
                            snapshot.forEach((data)=>{storedValue.push(data.val())})
                            // storedValue[5]=userCredential.user.email;
                            
                            console.log(storedValue)
                            // [
                            //     "0x2fd418E8eB82D9A47c39Db1F43BE94DE85757aAF",
                            //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                            //     "chairitydistributor@gmail.com",
                            //     "Chairity Distibutor",
                            //     "Vmtbpg6K3KdsnhxEC1ehclbbCIs2"
                            // ],
    
                            const dataToSend={
                                blockchainAccountAddress: storedValue[0],
                                description: storedValue[1],
                                email: storedValue[2],
                                title: storedValue[3],
                                userUid: storedValue[4],
                            }
                            resp.status(200).send({
                                responsePayload:dataToSend,
                                responseMessage:"Login sucessful",
                                responseCode:804
                            })
                        });

                    }
                    
                    
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
