"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

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
      hour: "2-digit",
      minute: "2-digit",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Cuenta</h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <div className="grid gap-6">
          {/* Información de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información de la Cuenta
              </CardTitle>
              <CardDescription>Tu información personal y detalles de la cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-gray-900">{user.displayName || "No especificado"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{user.email}</p>
                    {user.emailVerified && <Badge variant="secondary">Verificado</Badge>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Método de Autenticación</label>
                  <p className="text-gray-900">{getAuthProvider()}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">UID</label>
                  <p className="text-gray-900 font-mono text-sm">{user.uid}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cuenta Creada</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(user.metadata.creationTime)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Último Acceso</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(user.metadata.lastSignInTime)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Privacidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>Configuración de privacidad y opciones de seguridad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Verificado</h4>
                    <p className="text-sm text-gray-600">Tu dirección de email ha sido verificada</p>
                  </div>
                  <Badge variant={user.emailVerified ? "default" : "destructive"}>
                    {user.emailVerified ? "Verificado" : "No Verificado"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
