import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, orderBy, limit } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

//Initialize only once
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Auth exports
export const auth = getAuth(firebaseApp)
export const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
}
export { onAuthStateChanged }

// Firestore exports
export const db = getFirestore(firebaseApp)
export { doc, getDoc, setDoc, orderBy, limit }

// Storage exports
export const storage = getStorage(firebaseApp)
