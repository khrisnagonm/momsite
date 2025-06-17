"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, MapPin, Star, Plus, TrendingUp, Activity, AlertCircle } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Stats {
  totalEvents: number
  totalProfessionals: number
  totalUsers: number
  totalPlaces: number
  recentEvents: any[]
  recentUsers: any[]
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalProfessionals: 0,
    totalUsers: 0,
    totalPlaces: 0,
    recentEvents: [],
    recentUsers: [],
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (user && isAdmin && db) {
      loadStats()
    }
  }, [user, isAdmin])

  const loadStats = async () => {
    try {
      setLoadingStats(true)
      setError(null)

      console.log("Loading stats for admin:", user?.email)

      // Inicializar estadísticas por defecto
      let totalEvents = 0
      let totalProfessionals = 0
      let totalUsers = 0
      let totalPlaces = 0
      let recentEvents: any[] = []
      let recentUsers: any[] = []

      try {
        // Obtener estadísticas de eventos
        console.log("Fetching events...")
        const eventsQuery = query(collection(db, "events"))
        const eventsSnapshot = await getDocs(eventsQuery)
        totalEvents = eventsSnapshot.size

        // Obtener eventos recientes
        const recentEventsQuery = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(5))
        const recentEventsSnapshot = await getDocs(recentEventsQuery)
        recentEvents = recentEventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log("Events loaded:", totalEvents)
      } catch (eventsError) {
        console.warn("Error loading events:", eventsError)
      }

      try {
        // Obtener estadísticas de profesionales
        console.log("Fetching professionals...")
        const professionalsQuery = query(collection(db, "professionals"))
        const professionalsSnapshot = await getDocs(professionalsQuery)
        totalProfessionals = professionalsSnapshot.size
        console.log("Professionals loaded:", totalProfessionals)
      } catch (professionalsError) {
        console.warn("Error loading professionals:", professionalsError)
      }

      try {
        // Obtener estadísticas de usuarios
        console.log("Fetching users...")
        const usersQuery = query(collection(db, "users"))
        const usersSnapshot = await getDocs(usersQuery)
        totalUsers = usersSnapshot.size

        // Obtener usuarios recientes
        const recentUsersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        recentUsers = recentUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log("Users loaded:", totalUsers)
      } catch (usersError) {
        console.warn("Error loading users:", usersError)
      }

      try {
        // Obtener estadísticas de lugares
        console.log("Fetching places...")
        const placesQuery = query(collection(db, "places"))
        const placesSnapshot = await getDocs(placesQuery)
        totalPlaces = placesSnapshot.size
        console.log("Places loaded:", totalPlaces)
      } catch (placesError) {
        console.warn("Error loading places:", placesError)
      }

      setStats({
        totalEvents,
        totalProfessionals,
        totalUsers,
        totalPlaces,
        recentEvents,
        recentUsers,
      })

      console.log("Stats loaded successfully:", {
        totalEvents,
        totalProfessionals,
        totalUsers,
        totalPlaces,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
      setError("Error al cargar las estadísticas. Algunas funciones pueden estar limitadas.")
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha no disponible"
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      return "Fecha no disponible"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Bienvenida, {user.displayName || user.email}</p>
            </div>
            <Badge className="bg-pink-100 text-pink-700 px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              Administrador
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Activos</span>
                  </div>
                </div>
                <Calendar className="h-12 w-12 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesionales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProfessionals}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">Registrados</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Registrados</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lugares</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPlaces}</p>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">Disponibles</span>
                  </div>
                </div>
                <MapPin className="h-12 w-12 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/eventos/nuevo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-pink-300">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Nuevo Evento</p>
                <p className="text-sm text-gray-500">Crear evento o taller</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/profesionales/nuevo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-green-300">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Nuevo Profesional</p>
                <p className="text-sm text-gray-500">Agregar profesional</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/lugares/nuevo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-orange-300">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Nuevo Lugar</p>
                <p className="text-sm text-gray-500">Agregar ubicación</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/marketplace/nuevo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-purple-300">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Nuevo Producto</p>
                <p className="text-sm text-gray-500">Agregar al marketplace</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/eventos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Gestión de Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">Administra talleres, charlas y eventos</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{stats.totalEvents}</span>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/profesionales">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Profesionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">Gestiona el directorio de profesionales</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{stats.totalProfessionals}</span>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/lugares">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  Lugares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">Administra lugares de encuentro</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">{stats.totalPlaces}</span>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Eventos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{event.title || "Evento sin título"}</p>
                        <p className="text-sm text-gray-500">{event.category || "Sin categoría"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(event.createdAt)}</p>
                        <Badge variant="outline" className="text-xs">
                          {event.status || "Activo"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay eventos recientes</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Usuarios Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{user.displayName || user.email || "Usuario"}</p>
                        <p className="text-sm text-gray-500">{user.email || "Sin email"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                        <Badge variant="outline" className="text-xs">
                          {user.role || "Usuario"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay usuarios recientes</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
