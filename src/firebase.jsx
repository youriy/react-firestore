import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "xxxxxxxxxxxxxx.firebaseapp.com",
    databaseURL:
        "https://xxxxxxxxxxxxxxxxxxxxxx.europe-west1.firebasedatabase.app",
    projectId: "xxxxxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxx.xxxxxxxx.com",
    messagingSenderId: "xxxxxxxxxxxxxx",
    appId: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
    measurementId: "XXXXXXXXXXXXX",
});

const db = getFirestore();

export default db;
