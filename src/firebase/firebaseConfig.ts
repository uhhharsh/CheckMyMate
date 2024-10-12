import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_cUq3cyNnpb-5WMnUTMFa6Pnjp6Egvyo",
  authDomain: "checkmymate-efe2d.firebaseapp.com",
  projectId: "checkmymate-efe2d",
  storageBucket: "checkmymate-efe2d.appspot.com",
  messagingSenderId: "658055201447",
  appId: "1:658055201447:web:c88ed9c87113826ad71182",
  measurementId: "G-FBKF015EGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };