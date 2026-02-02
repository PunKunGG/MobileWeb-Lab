import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "lab06-expense-663380026-5.firebaseapp.com",
  projectId: "lab06-expense-663380026-5",
  storageBucket: "lab06-expense-663380026-5.appspot.com",
  messagingSenderId: "342112634375",
  appId: "1:342112634375:web:48e34e9066e60f7da40ca2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
