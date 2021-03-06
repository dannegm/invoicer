import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/firestore';
import ui from 'firebaseui';

firebase.initializeApp ({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
});

const auth = firebase.auth ();
const db = firebase.firestore ();
const storage = firebase.storage ();
const functions = firebase.functions ();

export {
    firebase,
    auth,
    db,
    storage,
    functions,
    ui,
};