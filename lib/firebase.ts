// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD33w1TK9bLzqtQuKzZ4-h0EV80ZG1ojM4",
    authDomain: "dscrd-cca37.firebaseapp.com",
    projectId: "dscrd-cca37",
    storageBucket: "dscrd-cca37.appspot.com",
    messagingSenderId: "669101095211",
    appId: "1:669101095211:web:e1682962bfeb1adc072d6e",
    measurementId: "G-4X9RWMLEVM"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
