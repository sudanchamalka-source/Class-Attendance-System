// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP97Utjqx54gmf9YaMsgWSK96TGTUCuSg",
  authDomain: "class-management-system-8c1a1.firebaseapp.com",
  databaseURL: "https://class-management-system-8c1a1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "class-management-system-8c1a1",
  storageBucket: "class-management-system-8c1a1.firebasestorage.app",
  messagingSenderId: "759521896885",
  appId: "1:759521896885:web:ab834180d9ab45968791fc",
  measurementId: "G-XZW2VLFXT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
