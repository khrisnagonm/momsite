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

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lista de emails de administradores
  const adminEmails = [
    "khrisnagonzalezm@gmail.com", // Tu email
    "admin@momsite.com",
    // Agrega más emails de admin aquí
  ]

  const isAdmin = user?.email ? adminEmails.includes(user.email) : false

  useEffect(() => {
    if (!auth) {
      setError("Firebase no está configurado correctamente")
      setLoading(false)
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
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError("Error de autenticación")
          setLoading(false)
        },
      )

      return unsubscribe
    } catch (err) {
      console.error("Firebase auth error:", err)
      setError("Error de configuración de Firebase")
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase no está configurado")
    }

    try {
      console.log("Attempting to sign in with:", email)
      await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful")
    } catch (err: any) {
      console.error("Sign in error:", err)
      if (err.code === "auth/user-not-found") {
        throw new Error("Usuario no encontrado")
      } else if (err.code === "auth/wrong-password") {
        throw new Error("Contraseña incorrecta")
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Email inválido")
      } else {
        throw new Error("Error al iniciar sesión")
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase no está configurado")
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      console.error("Sign up error:", err)
      if (err.code === "auth/email-already-in-use") {
        throw new Error("Este email ya está en uso")
      } else if (err.code === "auth/weak-password") {
        throw new Error("La contraseña es muy débil")
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Email inválido")
      } else {
        throw new Error("Error al crear la cuenta")
      }
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase no está configurado")
    }

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      console.error("Google sign in error:", err)
      if (err.code === "auth/popup-closed-by-user") {
        throw new Error("Inicio de sesión cancelado")
      } else {
        throw new Error("Error al iniciar sesión con Google")
      }
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase no está configurado")
    }

    try {
      console.log("Logging out...")
      await signOut(auth)
      setUserProfile(null)
      console.log("Logout successful")
    } catch (err) {
      console.error("Logout error:", err)
      throw new Error("Error al cerrar sesión")
    }
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
