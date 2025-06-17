"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Star, Users, Award, Clock, Heart, Share2, MessageCircle } from "lucide-react"
import type { Professional, SortOption } from "@/types"

// Empty array with explicit type
const professionals: Professional[] = []

const specialties = [
  "Todas las especialidades",
  "Pediatría",
  "Ginecología",
  "Psicología",
  "Nutrición",
  "Fisioterapia",
  "Matrona",
  "Lactancia",
  "Psicopedagogía",
]

const locations = [
  "Todas las ubicaciones",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Bilbao",
  "Málaga",
  "Zaragoza",
]

const sortOptions: SortOption[] = [
  { value: "rating", label: "Mejor valoradas" },
  { value: "reviews", label: "Más reseñas" },
  { value: "name", label: "Nombre A-Z" },
  { value: "experience", label: "Más experiencia" },
]

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas las especialidades")
  const [selectedLocation, setSelectedLocation] = useState("Todas las ubicaciones")
  const [sortBy, setSortBy] = useState("rating")

  const filteredProfessionals = professionals
    .filter((professional) => {
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSpecialty =
        selectedSpecialty === "Todas las especialidades" || professional.specialty === selectedSpecialty

      const matchesLocation = selectedLocation === "Todas las ubicaciones" || professional.location === selectedLocation

      return matchesSearch && matchesSpecialty && matchesLocation
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "name":
          return a.name.localeCompare(b.name)
        case "experience":
          return Number.parseInt(b.experience) - Number.parseInt(a.experience)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Profesionales de Confianza</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra especialistas verificados en maternidad, pediatría y bienestar familiar cerca de ti
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
                  placeholder="Buscar profesionales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
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
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={professional.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{professional.name}</h3>
                      {professional.verified && <Award className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{professional.specialty}</p>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(professional.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {professional.rating} ({professional.reviewCount} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{professional.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {professional.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {professional.experience} de experiencia
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {professional.services.slice(0, 2).map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {professional.services.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{professional.services.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
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
        {filteredProfessionals.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aún no hay profesionales registrados.</p>
              <p className="text-gray-400 text-sm mt-2">
                Pronto tendremos una red de profesionales verificados para ayudarte.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
