import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// Función para sanitizar nombres de archivo
function sanitizeFileName(fileName: string): string {
  return (
    fileName
      // Convertir a minúsculas
      .toLowerCase()
      // Reemplazar espacios con guiones
      .replace(/\s+/g, "-")
      // Eliminar acentos y caracteres especiales
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Mantener solo letras, números, guiones y puntos
      .replace(/[^a-z0-9.-]/g, "")
      // Eliminar múltiples guiones consecutivos
      .replace(/-+/g, "-")
      // Eliminar guiones al inicio y final
      .replace(/^-+|-+$/g, "")
      // Limitar longitud del nombre (sin extensión)
      .substring(0, 50)
  )
}

// Función para verificar si Firebase Storage está disponible
export async function checkStorageAvailability(): Promise<{ available: boolean; error?: string }> {
  try {
    if (!storage) {
      return { available: false, error: "Firebase Storage no está inicializado" }
    }

    const bucket = storage.app.options.storageBucket
    if (!bucket) {
      return { available: false, error: "No se ha configurado el bucket de Storage" }
    }

    console.log("🔧 Verificando Firebase Storage...")
    console.log("- Bucket:", bucket)
    console.log("- Project ID:", storage.app.options.projectId)

    // Intentar crear una referencia de prueba
    const testRef = ref(storage, "test/.keep")
    console.log("✅ Referencia de prueba creada exitosamente")

    return { available: true }
  } catch (error: any) {
    console.error("❌ Error verificando Storage:", error)
    return {
      available: false,
      error: error.message || "Error desconocido verificando Storage",
    }
  }
}

export async function uploadEventImage(file: File): Promise<string> {
  try {
    console.log("🔄 Iniciando subida de imagen...")
    console.log("📁 Detalles del archivo:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    })

    // Verificar disponibilidad de Storage primero
    const storageCheck = await checkStorageAvailability()
    if (!storageCheck.available) {
      throw new Error(storageCheck.error || "Firebase Storage no está disponible")
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen")
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("La imagen debe ser menor a 5MB")
    }

    // Sanitizar nombre del archivo
    const originalName = file.name
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"
    const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf(".")) || originalName
    const sanitizedName = sanitizeFileName(nameWithoutExtension)

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const fileName = `events/${timestamp}_${sanitizedName}.${extension}`

    console.log("📝 Nombre original:", originalName)
    console.log("📝 Nombre sanitizado:", sanitizedName)
    console.log("📝 Nombre final del archivo:", fileName)

    // Crear referencia en Firebase Storage
    const storageRef = ref(storage, fileName)
    console.log("📍 Referencia creada")

    console.log("⬆️ Subiendo archivo...")

    // Subir archivo con metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: originalName,
        sanitizedName: sanitizedName,
        uploadedAt: new Date().toISOString(),
      },
    }

    const snapshot = await uploadBytes(storageRef, file, metadata)
    console.log("✅ Archivo subido exitosamente")

    console.log("🔗 Obteniendo URL de descarga...")
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("🎉 URL obtenida:", downloadURL)

    return downloadURL
  } catch (error: any) {
    console.error("❌ Error en uploadEventImage:", error)

    // Manejo específico de errores de Firebase
    if (error?.code) {
      console.error("🔥 Código de error Firebase:", error.code)
      console.error("📝 Mensaje:", error.message)

      switch (error.code) {
        case "storage/unknown":
          throw new Error(
            "Firebase Storage no está habilitado en tu proyecto. Ve a Firebase Console → Storage → Get Started",
          )
        case "storage/unauthorized":
          throw new Error("No tienes permisos para subir archivos. Verifica que estés autenticado.")
        case "storage/canceled":
          throw new Error("La subida fue cancelada.")
        case "storage/quota-exceeded":
          throw new Error("Se ha excedido la cuota de almacenamiento.")
        case "storage/retry-limit-exceeded":
          throw new Error("Se agotaron los intentos de subida.")
        case "storage/invalid-format":
          throw new Error("Formato de archivo no válido.")
        default:
          throw new Error(`Error de Firebase Storage (${error.code}): ${error.message}`)
      }
    }

    // Error genérico
    throw new Error(error.message || "Error desconocido al subir la imagen")
  }
}

export const uploadImage = async (file: File, folder = "general"): Promise<string> => {
  try {
    // Sanitizar nombre del archivo
    const originalName = file.name
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"
    const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf(".")) || originalName
    const sanitizedName = sanitizeFileName(nameWithoutExtension)

    // Generar nombre único
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const fileName = `${folder}/${timestamp}_${sanitizedName}.${extension}`

    console.log("📝 Subiendo imagen:", {
      original: originalName,
      sanitized: sanitizedName,
      final: fileName,
    })

    const storageRef = ref(storage, fileName)

    // Metadata con información del archivo original
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: originalName,
        sanitizedName: sanitizedName,
        uploadedAt: new Date().toISOString(),
      },
    }

    const snapshot = await uploadBytes(storageRef, file, metadata)
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log("✅ Imagen subida exitosamente:", downloadURL)
    return downloadURL
  } catch (error) {
    console.error("❌ Error uploading image:", error)
    throw new Error("Error al subir la imagen")
  }
}

export const uploadProfessionalImage = async (file: File): Promise<string> => {
  return uploadImage(file, "professionals")
}

export const uploadPlaceImage = async (file: File): Promise<string> => {
  return uploadImage(file, "places")
}

export async function deleteEventImage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl || !imageUrl.includes("firebase")) {
      console.log("🔍 No es una URL de Firebase, omitiendo eliminación")
      return
    }

    // Extraer el path del archivo de la URL
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)

    if (pathMatch) {
      const filePath = decodeURIComponent(pathMatch[1])
      console.log("🗑️ Eliminando archivo:", filePath)
      const storageRef = ref(storage, filePath)
      await deleteObject(storageRef)
      console.log("✅ Archivo eliminado exitosamente")
    }
  } catch (error) {
    console.error("❌ Error eliminando imagen:", error)
    // No lanzar error para no interrumpir otras operaciones
  }
}
