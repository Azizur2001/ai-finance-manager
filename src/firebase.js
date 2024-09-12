import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPNj0kNBbhEfkymk-An2phorbCfUrPSYE",
  authDomain: "ai-finance-manager.firebaseapp.com",
  projectId: "ai-finance-manager",
  storageBucket: "ai-finance-manager.appspot.com",
  messagingSenderId: "100574475988",
  appId: "1:100574475988:web:459894cb2a9f0f20a6ed41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const isAuthenticated = (callback) => {
    onAuthStateChanged(auth, (user) => {
      callback(!!user);
    });
  };
  
export { auth, db, isAuthenticated };
