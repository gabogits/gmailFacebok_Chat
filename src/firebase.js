const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");


const firebaseConfig = {
    //configuration
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {
    firebase,
    db,
    auth,
    storage
}