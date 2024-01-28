// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "yusuf-estate.firebaseapp.com",
  projectId: "yusuf-estate",
  storageBucket: "yusuf-estate.appspot.com",
  messagingSenderId: "563241763727",
  appId: "1:563241763727:web:7b8205f52730d135e1c1fa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
