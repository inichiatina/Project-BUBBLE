import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDU_qlWD5lT4Sr7wZh0DbGwClOLevxFiSc",
    authDomain: "pop-the-bubble-a1556.firebaseapp.com",
    projectId: "pop-the-bubble-a1556",
    storageBucket: "pop-the-bubble-a1556.firebasestorage.app",
    messagingSenderId: "56698072087",
    appId: "1:56698072087:web:dc93713c3f87f6e3904052"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);