"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { MapPin, Plus, Search, Edit, Trash2, Eye, Star, Clock, Users, Wifi, Car, ArrowLeft } from "lucide-react"
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface Place {
  id: string
  name: string
  category: string
  description: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  rating: number
  reviewCount: number
  isAccessible: boolean
  isVerified: boolean
  isActive: boolean
  isFree: boolean
  price: number
  amenities: string[]
  hours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  createdAt: any
  updatedAt: any
  createdBy: string
}

export default function LugaresAdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [places, setPlaces] = useState<Place[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [loadingPlaces, setLoadingPlaces] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterCity, setFilterCity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (user && isAdmin && db) {
      loadPlaces()
    }
  }, [user, isAdmin])

  useEffect(() => {
    filterPlaces()
  }, [places, searchTerm, filterCategory, filterCity, filterStatus])

  const loadPlaces = () => {
    try {
      const placesQuery = query(collection(db, "places"), orderBy("createdAt", "desc"))

      const unsubscribe = onSnapshot(placesQuery, (snapshot) => {
        const placesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Place[]

        setPlaces(placesData)
        setLoadingPlaces(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error loading places:", error)
      toast.error("Error al cargar lugares")
      setLoadingPlaces(false)
    }
  }

  const filterPlaces = () => {
    let filtered = places

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (filterCategory !== "all") {
      filtered = filtered.filter((place) => place.category === filterCategory)
    }

    // Filtro por ciudad
    if (filterCity !== "all") {
      filtered = filtered.filter((place) => place.city === filterCity)
    }

    // Filtro por estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((place) => {
        switch (filterStatus) {
          case "active":
            return place.isActive
          case "inactive":
            return !place.isActive
          case "verified":
            return place.isVerified
          case "accessible":
            return place.isAccessible
          default:
            return true
        }
      })
    }

    setFilteredPlaces(filtered)
  }

  const handleDeletePlace = async (placeId: string, placeName: string) => {
    try {
      await deleteDoc(doc(db, "places", placeId))
      toast.success(`Lugar "${placeName}" eliminado correctamente`)
    } catch (error) {
      console.error("Error deleting place:", error)
      toast.error("Error al eliminar el lugar")
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha no disponible"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Parque: "bg-green-100 text-green-800",
      Cafetería: "bg-orange-100 text-orange-800",
      "Centro Comercial": "bg-blue-100 text-blue-800",
      Biblioteca: "bg-purple-100 text-purple-800",
      "Centro Comunitario": "bg-pink-100 text-pink-800",
      Restaurante: "bg-red-100 text-red-800",
      "Espacio Cultural": "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const uniqueCategories = Array.from(new Set(places.map((p) => p.category))).sort()
  const uniqueCities = Array.from(new Set(places.map((p) => p.city))).sort()

  if (loading || loadingPlaces) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando lugares...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Back to Admin Panel */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-pink-600 hover:text-pink-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Lugares</h1>
            <p className="text-gray-600 mt-1">Administra los lugares de encuentro para madres</p>
          </div>
          <Link href="/admin/lugares/nuevo">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Lugar
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{places.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verificados</p>
                  <p className="text-2xl font-bold text-green-600">{places.filter((p) => p.isVerified).length}</p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-blue-600">{places.filter((p) => p.isActive).length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accesibles</p>
                  <p className="text-2xl font-bold text-purple-600">{places.filter((p) => p.isAccessible).length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar lugares..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                  <SelectItem value="accessible">Accesibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Places Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Lugares ({filteredPlaces.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPlaces.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lugar</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comodidades</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlaces.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-pink-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">{place.name}</p>
                                {place.isVerified && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              </div>
                              <p className="text-sm text-gray-500">{place.description?.substring(0, 50)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getCategoryColor(place.category)}>
                            {place.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{place.city}</p>
                            <p className="text-xs text-gray-500">{place.address?.substring(0, 30)}...</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{place.rating?.toFixed(1) || "0.0"}</span>
                            <span className="text-xs text-gray-500">({place.reviewCount || 0})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {place.amenities?.slice(0, 2).map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity === "WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                                {amenity === "Estacionamiento" && <Car className="h-3 w-3 mr-1" />}
                                {amenity}
                              </Badge>
                            ))}
                            {place.amenities && place.amenities.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{place.amenities.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge
                              variant={place.isActive ? "default" : "secondary"}
                              className={place.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {place.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            {place.isAccessible && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                Accesible
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{formatDate(place.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar lugar?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el lugar "
                                    {place.name}" y todos sus datos asociados.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePlace(place.id, place.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay lugares</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterCategory !== "all" || filterCity !== "all" || filterStatus !== "all"
                    ? "No se encontraron lugares con los filtros aplicados."
                    : "Comienza agregando tu primer lugar de encuentro."}
                </p>
                <Link href="/admin/lugares/nuevo">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Lugar
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
