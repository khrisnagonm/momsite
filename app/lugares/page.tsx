"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Clock, Accessibility, Heart, Share2, Navigation, Filter } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"

interface Place {
  id: string
  name: string
  description: string
  category: string
  region: string
  city: string
  address: string
  rating: number
  reviewCount: number
  isAccessible: boolean
  isFree: boolean
  price: number
  amenities: string[]
  hours: { [key: string]: { open: string; close: string; closed: boolean } }
  images: string[]
  createdAt: any
}

interface SortOption {
  value: string
  label: string
}

export default function MeetingPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const categories = [
    "Parque",
    "Cafetería",
    "Centro Comercial",
    "Biblioteca",
    "Centro Comunitario",
    "Restaurante",
    "Espacio Cultural",
    "Gimnasio",
    "Spa",
    "Centro de Salud",
  ]

  const regions = [
    "Región Metropolitana",
    "Región de Valparaíso",
    "Región del Biobío",
    "Región de La Araucanía",
    "Región de Coquimbo",
    "Región del Libertador Bernardo O'Higgins",
    "Región del Maule",
    "Región de Los Ríos",
    "Región de Los Lagos",
    "Región de Tarapacá",
    "Región de Arica y Parinacota",
    "Región de Atacama",
    "Región de Magallanes y Antártica Chilena",
    "Región de Aysén",
  ]

  const sortOptions: SortOption[] = [
    { value: "rating", label: "Mejor valorados" },
    { value: "reviews", label: "Más reseñas" },
    { value: "name", label: "Nombre A-Z" },
    { value: "newest", label: "Más recientes" },
  ]

  useEffect(() => {
    loadPlaces()
  }, [])

  useEffect(() => {
    filterPlaces()
  }, [places, searchTerm, selectedCategory, selectedRegion, sortBy])

  const loadPlaces = async () => {
    if (!db) return

    try {
      setLoading(true)
      // Solo obtener lugares activos
      const placesQuery = query(collection(db, "places"), where("isActive", "==", true))
      const querySnapshot = await getDocs(placesQuery)

      const placesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Place[]

      setPlaces(placesData)
    } catch (error) {
      console.error("Error loading places:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPlaces = () => {
    let filtered = places

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((place) => place.category === selectedCategory)
    }

    // Filtrar por región
    if (selectedRegion !== "all") {
      filtered = filtered.filter((place) => place.region === selectedRegion)
    }

    // Ordenar
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0)
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        default:
          return 0
      }
    })

    setFilteredPlaces(filtered)
  }

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree || price === 0) return "Gratis"
    return `$${price.toLocaleString("es-CL")} CLP`
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      Parque: "🌳",
      Cafetería: "☕",
      "Centro Comercial": "🛍️",
      Biblioteca: "📚",
      "Centro Comunitario": "🏢",
      Restaurante: "🍽️",
      "Espacio Cultural": "🎭",
      Gimnasio: "💪",
      Spa: "🧘‍♀️",
      "Centro de Salud": "🏥",
    }
    return emojiMap[category] || "📍"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando lugares...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lugares de Encuentro</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre espacios perfectos para conectar con otras madres y disfrutar con tus hijos
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar lugares..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryEmoji(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las regiones</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        🗺️ {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lugares */}
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay lugares disponibles</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all" || selectedRegion !== "all"
                ? "No se encontraron lugares que coincidan con los filtros seleccionados."
                : "Aún no hay lugares programados. ¡Vuelve pronto para ver las novedades!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Imagen del lugar */}
                <div className="relative h-48 bg-gray-200">
                  {place.images && place.images.length > 0 ? (
                    <Image
                      src={place.images[0] || "/placeholder.svg"}
                      alt={place.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                    {getCategoryEmoji(place.category)} {place.category}
                  </Badge>
                  {place.isFree && <Badge className="absolute top-2 left-2 bg-green-500">🎁 Gratis</Badge>}
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{place.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{place.description}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {place.address}, {place.city}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {place.hours?.monday && !place.hours.monday.closed
                        ? `${place.hours.monday.open} - ${place.hours.monday.close}`
                        : "Ver horarios"}
                    </div>
                    {place.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />⭐ {place.rating.toFixed(1)} (
                        {place.reviewCount} reseñas)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(place.price, place.isFree)}
                    </span>
                    {place.isAccessible && <Accessibility className="h-4 w-4 text-green-500" />}
                  </div>

                  {/* Amenidades */}
                  {place.amenities && place.amenities.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {place.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          🏷️ {amenity}
                        </Badge>
                      ))}
                      {place.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          ➕ {place.amenities.length - 3} más
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                      <Navigation className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
