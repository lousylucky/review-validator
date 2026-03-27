import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDOPNj4_kmgdbWfaxCWshZU1IZF6xIOwB4',
  authDomain: 'review-validator-5e0c7.firebaseapp.com',
  projectId: 'review-validator-5e0c7',
  storageBucket: 'review-validator-5e0c7.firebasestorage.app',
  messagingSenderId: '109860727252',
  appId: '1:109860727252:web:8c56c5734efe063a458e41',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
