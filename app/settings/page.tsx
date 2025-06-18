"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Calendar, Shield, ArrowLeft, Edit, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { updateProfile, updateEmail, sendEmailVerification } from "firebase/auth"
import Link from "next/link"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [originalDisplayName, setOriginalDisplayName] = useState("")
  const [originalEmail, setOriginalEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (user) {
      const name = user.displayName || ""
      const userEmail = user.email || ""
      setDisplayName(name)
      setEmail(userEmail)
      setOriginalDisplayName(name)
      setOriginalEmail(userEmail)
    }
  }, [user, loading, router])

  const handleEdit = () => {
    setIsEditing(true)
    setMessage({ text: "", type: "" })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setDisplayName(originalDisplayName)
    setEmail(originalEmail)
    setMessage({ text: "", type: "" })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Actualizar nombre
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName })
      }

      // Actualizar email
      if (email !== user.email) {
        await updateEmail(user, email)
        // Enviar email de verificación
        await sendEmailVerification(user)
        setMessage({
          text: "✅ Perfil actualizado correctamente. Se ha enviado un email de verificación a tu nueva dirección.",
          type: "success",
        })
      } else {
        setMessage({
          text: "✅ Perfil actualizado correctamente",
          type: "success",
        })
      }

      // Actualizar los valores originales
      setOriginalDisplayName(displayName)
      setOriginalEmail(email)

      // Salir del modo edición
      setIsEditing(false)

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 3000)
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error)
      let errorMessage = "❌ Error al actualizar el perfil"

      if (error.code === "auth/requires-recent-login") {
        errorMessage = "❌ Por seguridad, necesitas iniciar sesión nuevamente para cambiar tu email"
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "❌ Este email ya está en uso por otra cuenta"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "❌ El formato del email no es válido"
      }

      setMessage({
        text: errorMessage,
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
              <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder a la configuración.</p>
              <Button onClick={() => router.push("/auth/login")} className="bg-pink-500 hover:bg-pink-600">
                Iniciar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "No disponible"
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAuthProvider = () => {
    if (!user.providerData.length) return "Email/Contraseña"
    const provider = user.providerData[0].providerId
    switch (provider) {
      case "google.com":
        return "Google"
      case "password":
        return "Email/Contraseña"
      default:
        return provider
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-7 w-7 text-pink-500" />
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <div className="grid gap-6">
          {/* Mensaje de estado */}
          {message.text && (
            <div
              className={`p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Información de la Cuenta */}
          <Card className="border-pink-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-white pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-500" />
                  Información Personal
                </CardTitle>

                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="displayName" className="text-gray-700">
                        Nombre
                      </Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="border-gray-200 focus:border-pink-300"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-200 focus:border-pink-300"
                        placeholder="Ingresa tu email"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <p className="text-gray-900 text-lg">{displayName || "No especificado"}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900 text-lg">{email}</p>
                        {user.emailVerified && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verificado</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Método de Autenticación</label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50">
                      {getAuthProvider()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cuenta Creada</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(user.metadata.creationTime)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Privacidad */}
          <Card className="border-pink-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-white pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Shield className="h-5 w-5 text-pink-500" />
                Privacidad y Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Verificado</h4>
                    <p className="text-sm text-gray-600">
                      {user.emailVerified
                        ? "Tu dirección de email ha sido verificada"
                        : "Por favor verifica tu dirección de email"}
                    </p>
                  </div>
                  <Badge
                    variant={user.emailVerified ? "default" : "outline"}
                    className={
                      user.emailVerified
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {user.emailVerified ? "Verificado" : "No Verificado"}
                  </Badge>
                </div>

                {!user.emailVerified && (
                  <Button
                    onClick={async () => {
                      try {
                        await sendEmailVerification(user)
                        setMessage({
                          text: "📧 Email de verificación enviado. Por favor revisa tu bandeja de entrada.",
                          type: "success",
                        })
                      } catch (error: any) {
                        setMessage({
                          text: "❌ Error al enviar email de verificación",
                          type: "error",
                        })
                      }
                    }}
                    variant="outline"
                    className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email de Verificación
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
