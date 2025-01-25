import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyU-rt0P7_mezRXk0C_68X7OLRSm_UMBE",
  authDomain: "employee-management-syst-9f4bd.firebaseapp.com",
  projectId: "employee-management-syst-9f4bd",
  storageBucket: "employee-management-syst-9f4bd.firebasestorage.app",
  messagingSenderId: "949708868685",
  appId: "1:949708868685:web:1e6a8d42f164fe80b2a004",
  measurementId: "G-990PD9BN1G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
