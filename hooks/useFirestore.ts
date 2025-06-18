"use client"

import { useState } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  type QueryConstraint,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

// Generic hook for Firestore operations
export function useFirestore<T extends { id: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Get all documents
  const getAll = async (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true)
      setError(null)

      const q = query(collection(db, collectionName), ...constraints)
      const snapshot = await getDocs(q)

      const documents = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
        }
      }) as T[]

      setData(documents)
      return documents
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err)
      const errorMessage = err instanceof Error ? err.message : `Error fetching ${collectionName}`
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Get single document
  const getById = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as T
      }
      return null
    } catch (err) {
      console.error(`Error fetching document ${id}:`, err)
      const errorMessage = err instanceof Error ? err.message : "Error fetching document"
      setError(errorMessage)
      return null
    }
  }

  // Add new document
  const add = async (data: Omit<T, "id">) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      }

      const docRef = await addDoc(collection(db, collectionName), docData)
      toast.success("Documento agregado exitosamente")
      return docRef.id
    } catch (err) {
      console.error(`Error adding document:`, err)
      const errorMessage = err instanceof Error ? err.message : "Error agregando documento"
      toast.error(errorMessage)
      throw err
    }
  }

  // Update document
  const update = async (id: string, data: Partial<Omit<T, "id">>) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      const docRef = doc(db, collectionName, id)
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }

      await updateDoc(docRef, updateData)
      toast.success("Documento actualizado exitosamente")
    } catch (err) {
      console.error(`Error updating document:`, err)
      const errorMessage = err instanceof Error ? err.message : "Error actualizando documento"
      toast.error(errorMessage)
      throw err
    }
  }

  // Delete document
  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
      toast.success("Documento eliminado exitosamente")
    } catch (err) {
      console.error(`Error deleting document:`, err)
      const errorMessage = err instanceof Error ? err.message : "Error eliminando documento"
      toast.error(errorMessage)
      throw err
    }
  }

  // Subscribe to real-time updates
  const subscribe = (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true)
      setError(null)
      const q = query(collection(db, collectionName), ...constraints)

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[]
          setData(documents)
          setLoading(false)
        },
        (err) => {
          console.error(`Error in ${collectionName} subscription:`, err)
          const errorMessage = err instanceof Error ? err.message : `Error subscribing to ${collectionName}`
          setError(errorMessage)
          setLoading(false)
        },
      )

      return unsubscribe
    } catch (err) {
      console.error(`Error setting up subscription:`, err)
      const errorMessage = err instanceof Error ? err.message : "Error setting up subscription"
      setError(errorMessage)
      setLoading(false)
      return () => {}
    }
  }

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    subscribe,
  }
}

// Specific hooks for each collection
export const useProfessionals = () => useFirestore<import("@/types/firebase").Professional>("professionals")
export const useMeetingPlaces = () => useFirestore<import("@/types/firebase").MeetingPlace>("meetingPlaces")
export const useEvents = () => useFirestore<import("@/types/firebase").Event>("events")
export const useForumPosts = () => useFirestore<import("@/types/firebase").ForumPost>("forumPosts")
export const useProducts = () => useFirestore<import("@/types/firebase").Product>("products")
