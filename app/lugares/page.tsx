"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Clock, Accessibility, Heart, Share2, Navigation } from "lucide-react"
import type { MeetingPlace, SortOption } from "@/types"

// Empty array with explicit type
const meetingPlaces: MeetingPlace[] = []

const categories = [
  "Todas las categorías",
  "Parques",
  "Cafeterías",
  "Centros comerciales",
  "Bibliotecas",
  "Centros culturales",
  "Espacios de juego",
  "Restaurantes",
]

const cities = ["Todas las ciudades", "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga", "Zaragoza"]

const sortOptions: SortOption[] = [
  { value: "rating", label: "Mejor valorados" },
  { value: "reviews", label: "Más reseñas" },
  { value: "name", label: "Nombre A-Z" },
  { value: "newest", label: "Más recientes" },
]

export default function MeetingPlacesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías")
  const [selectedCity, setSelectedCity] = useState("Todas las ciudades")
  const [sortBy, setSortBy] = useState("rating")

  const filteredPlaces = meetingPlaces
    .filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "Todas las categorías" || place.category === selectedCategory

      const matchesCity = selectedCity === "Todas las ciudades" || place.city === selectedCity

      return matchesSearch && matchesCategory && matchesCity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

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
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar lugares..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={place.image || "/placeholder.svg?height=200&width=400"}
                  alt={place.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-gray-800">{place.category}</Badge>
                </div>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(place.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {place.rating} ({place.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {place.address}, {place.city}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {place.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {place.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{place.amenities.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {place.schedule.hours}
                  </div>
                  {place.accessibility && <Accessibility className="h-4 w-4 text-green-500" />}
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    Cómo llegar
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

        {/* Empty State */}
        {filteredPlaces.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aún no hay lugares registrados.</p>
              <p className="text-gray-400 text-sm mt-2">
                Pronto tendremos una lista de lugares perfectos para conectar con otras madres.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
