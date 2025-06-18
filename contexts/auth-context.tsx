"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  role: "user" | "admin"
  createdAt: Date
  lastLoginAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Lista de emails de administradores
  const adminEmails = [
    "khrisnagonzalezm@gmail.com", // Tu email
    "admin@momsite.com",
    // Agrega más emails de admin aquí
  ]

  const isAdmin = user?.email ? adminEmails.includes(user.email) : false

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Error al iniciar sesión")
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Error al registrarse")
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error("Sign in with Google error:", err)
      setError("Error al iniciar sesión con Google")
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("Logout error:", err)
      setError("Error al cerrar sesión")
    }
  }

  useEffect(() => {
    if (!auth) {
      setError("Firebase no está configurado correctamente")
      setLoading(false)
      setInitialized(true)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          console.log("Auth state changed:", user ? "User logged in" : "User logged out")
          setUser(user)

          if (user) {
            // Crear perfil basado en la información de Firebase Auth
            const profile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || undefined,
              role: adminEmails.includes(user.email!) ? "admin" : "user",
              createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
              lastLoginAt: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date(),
            }
            setUserProfile(profile)
            console.log("User profile created:", profile)
            console.log("Is admin:", adminEmails.includes(user.email!))
          } else {
            setUserProfile(null)
          }

          setLoading(false)
          setError(null)
          setInitialized(true)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError("Error de autenticación")
          setLoading(false)
          setInitialized(true)
        },
      )

      return unsubscribe
    } catch (err) {
      console.error("Firebase auth error:", err)
      setError("Error de configuración de Firebase")
      setLoading(false)
      setInitialized(true)
    }
  }, [])

  // Don't render children until context is initialized
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando...</p>
        </div>
      </div>
    )
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
