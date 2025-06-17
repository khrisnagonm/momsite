"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Share2,
  Baby,
  BookOpen,
  Coffee,
  Music,
  Palette,
  Gamepad2,
} from "lucide-react"
import type { Event, SortOption } from "@/types"

// Empty array with explicit type
const events: Event[] = []

const categories = [
  { name: "Todas", icon: <Calendar className="h-4 w-4" />, count: 0 },
  { name: "Talleres", icon: <BookOpen className="h-4 w-4" />, count: 0 },
  { name: "Charlas", icon: <Coffee className="h-4 w-4" />, count: 0 },
  { name: "Actividades", icon: <Gamepad2 className="h-4 w-4" />, count: 0 },
  { name: "Música", icon: <Music className="h-4 w-4" />, count: 0 },
  { name: "Arte", icon: <Palette className="h-4 w-4" />, count: 0 },
  { name: "Deportes", icon: <Users className="h-4 w-4" />, count: 0 },
]

const ageGroups = [
  "Todas las edades",
  "0-6 meses",
  "6-12 meses",
  "1-2 años",
  "2-3 años",
  "3-5 años",
  "5+ años",
  "Embarazadas",
  "Solo madres",
]

const sortOptions: SortOption[] = [
  { value: "date", label: "Próximos eventos" },
  { value: "popular", label: "Más populares" },
  { value: "price", label: "Precio: menor a mayor" },
  { value: "newest", label: "Recién añadidos" },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("Todas las edades")
  const [sortBy, setSortBy] = useState("date")

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "Todas" || event.category === selectedCategory

      const matchesAgeGroup = selectedAgeGroup === "Todas las edades" || event.ageGroup === selectedAgeGroup

      return matchesSearch && matchesCategory && matchesAgeGroup
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "popular":
          return b.currentAttendees - a.currentAttendees
        case "price":
          return a.price - b.price
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Eventos y Actividades</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre talleres, charlas y actividades diseñadas especialmente para madres y sus hijos
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
                  placeholder="Buscar eventos..."
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
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center space-x-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((ageGroup) => (
                    <SelectItem key={ageGroup} value={ageGroup}>
                      {ageGroup}
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
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg?height=200&width=400"}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white text-gray-800">{event.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Baby className="h-4 w-4 mr-2" />
                    {event.ageGroup}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {event.price === 0 ? "Gratis" : `€${event.price}`}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {event.currentAttendees}
                    {event.maxAttendees && `/${event.maxAttendees}`}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{event.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Inscribirse
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
        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aún no hay eventos programados.</p>
              <p className="text-gray-400 text-sm mt-2">
                Pronto tendremos una agenda llena de actividades especiales para ti y tu familia.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
