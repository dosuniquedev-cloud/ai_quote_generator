import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//firebase console data[default]
const firebaseConfig = {
    apiKey: "AIzaSyABkB-Erj909dYH5_PNGtmAip69bG0sd6w",
    authDomain: "ai-quote-generator-6ecbb.firebaseapp.com",
    projectId: "ai-quote-generator-6ecbb",
    storageBucket: "ai-quote-generator-6ecbb.firebasestorage.app",
    messagingSenderId: "47631058880",
    appId: "1:47631058880:web:4a83c840ccd63d0e512a25",
    measurementId: "G-J2TBVYLEFK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);