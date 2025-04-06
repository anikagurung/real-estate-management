// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5b6d6.firebaseapp.com",
  projectId: "mern-estate-5b6d6",
  storageBucket: "mern-estate-5b6d6.firebasestorage.app",
  messagingSenderId: "69461534457",
  appId: "1:69461534457:web:ee426ce52b7ed18c022428"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);