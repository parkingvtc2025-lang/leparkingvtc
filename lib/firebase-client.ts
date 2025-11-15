import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Same public config as Admin app
const firebaseConfig = {
  apiKey: "AIzaSyCGAQzx9I4og-kgEBj-mzI53axWjwp49Ms",
  authDomain: "parkingvtc-25954.firebaseapp.com",
  projectId: "parkingvtc-25954",
  storageBucket: "parkingvtc-25954.firebasestorage.app",
  messagingSenderId: "273978379775",
  appId: "1:273978379775:web:d0c99a92911086a186ebca",
  measurementId: "G-Z6KCS1RDJ2",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
