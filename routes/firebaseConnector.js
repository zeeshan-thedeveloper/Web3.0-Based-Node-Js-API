const admin = require('firebase-admin');
const firebase = require('firebase');
// const { getDatabase } = require('firebase-admin/database');

var serviceAccount = require("./charity-distributor-firebase-adminsdk-q9fbi-e42224c67b.json");
 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://charity-distributor-default-rtdb.firebaseio.com/"
});
 
const firebaseConfig = {
    apiKey: "AIzaSyAVoI-j7EUuLOoBURuuMMLNcuntN4zVysI",
    authDomain: "charity-distributor.firebaseapp.com",
    projectId: "charity-distributor",
    storageBucket: "charity-distributor.appspot.com",
    messagingSenderId: "64076488434",
    appId: "1:64076488434:web:18ce9724498b874536fa6b",
    measurementId: "G-GKE17FLW65"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// module.exports=firebase;
// module.exports=admin;

const db = admin.database();
const ref = db.ref();
  
module.exports={
  firebase,
  admin,
  firebaseConfig,
  ref
}
