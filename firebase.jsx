import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDXoczTas80oCMx-rIQnVii4ZkYYi_F8iY",
  authDomain: "employees-365a4.firebaseapp.com",
  projectId: "employees-365a4",
  storageBucket: "employees-365a4.appspot.com", // Corregido aquí
  messagingSenderId: "219004356686",
  appId: "1:219004356686:web:b097b3822f1a18e59cdb1f",
  measurementId: "G-LHMGXJJKDJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
