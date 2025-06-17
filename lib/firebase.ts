import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Validate Firebase configuration only in browser
if (typeof window !== "undefined") {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.warn("Missing Firebase environment variables:", missingEnvVars)
  }
}

let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.error("Firebase initialization error:", error)
  throw new Error("Failed to initialize Firebase. Please check your configuration.")
}

// Helper function to ensure db is initialized
export function getDb(): Firestore {
  if (!db) {
    throw new Error("Firestore is not initialized")
  }
  return db
}

// Helper function to ensure auth is initialized
export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error("Auth is not initialized")
  }
  return auth
}

// Helper function to ensure storage is initialized
export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    throw new Error("Storage is not initialized")
  }
  return storage
}

// Export with proper types - these will throw if not initialized
export { auth, db, storage }
export type { FirebaseApp, Auth, Firestore, FirebaseStorage }
export default app
