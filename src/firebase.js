import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQhqQRsCcIUmGRPihHFSCV8BUILxr407c",
  authDomain: "yumyard-579ad.firebaseapp.com",
  databaseURL: "https://yumyard-579ad-default-rtdb.firebaseio.com",
  projectId: "yumyard-579ad",
  storageBucket: "yumyard-579ad.appspot.com",
  messagingSenderId: "388265530509",
  appId: "1:388265530509:web:bdbf484ee127a0758cbec4",
  measurementId: "G-R3MSK0B489",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const storage = getStorage(app);

const analytics = getAnalytics(app);
const database = getDatabase(app);
export { auth, database };
