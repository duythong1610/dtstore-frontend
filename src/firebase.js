// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALHW7RVpgwVWYzd0p-97yueNgbZf9kT1Y",
  authDomain: "october16th.firebaseapp.com",
  projectId: "october16th",
  storageBucket: "october16th.appspot.com",
  messagingSenderId: "1056065059190",
  appId: "1:1056065059190:web:fc174e81cfcf2f0d1ca257",
  measurementId: "G-YGG0EB6LVK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
