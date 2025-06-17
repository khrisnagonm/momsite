"use client"

import { useState, useEffect } from "react"
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
  BookOpen,
  Coffee,
  Music,
  Palette,
  Gamepad2,
  CalendarDays,
} from "lucide-react"
import { useEvents } from "@/hooks/useFirestore"

const categories = [
  { name: "Todas", icon: <Calendar className="h-4 w-4" /> },
  { name: "Salud", icon: <Heart className="h-4 w-4" /> },
  { name: "Creatividad", icon: <Palette className="h-4 w-4" /> },
  { name: "Talleres", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Charlas", icon: <Coffee className="h-4 w-4" /> },
  { name: "Actividades", icon: <Gamepad2 className="h-4 w-4" /> },
  { name: "Música", icon: <Music className="h-4 w-4" /> },
  { name: "Deportes", icon: <Users className="h-4 w-4" /> },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const { data: allEvents, loading, error, getAll } = useEvents()

  // Load events ONLY once on mount - NO dependencies that change
  useEffect(() => {
    getAll()
  }, []) // Empty dependency array - only runs once

  // Simple filtering
  const filteredEvents = allEvents.filter((event) => {
    if (!event.title) return false

    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "Todas" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha por confirmar"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Fecha por confirmar"
    }
  }

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
        {/* Simple Debug Info */}
        <Card className="mb-8 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <h3 className="font-bold">📊 Estado Actual</h3>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || "None"}</p>
              <p>Total Events: {allEvents.length}</p>
              <p>Filtered Events: {filteredEvents.length}</p>
              <p>Search: "{searchTerm}"</p>
              <p>Category: {selectedCategory}</p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2">Cargando eventos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-200">
            <CardContent className="pt-6 text-center py-12">
              <CalendarDays className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-red-500">Error al cargar eventos</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
              <Button onClick={() => getAll()} className="mt-4">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Events or Empty State */}
        {!loading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-gray-600">Mostrando {filteredEvents.length} evento(s)</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative">
                        <img
                          src="/placeholder.svg?height=200&width=400&text=Evento"
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white text-gray-800">{event.category}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="secondary" className="bg-black/70 text-white">
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.time || "Hora por confirmar"}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location || "Ubicación por confirmar"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-green-600">
                            {event.price === 0 ? "Gratis" : `$${event.price?.toLocaleString("es-CL")}`}
                          </span>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            {event.currentAttendees || 0}/{event.maxAttendees || "∞"}
                          </div>
                        </div>

                        <Button className="w-full" size="sm">
                          Inscribirse
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {allEvents.length === 0 ? "No hay eventos disponibles" : "No se encontraron eventos"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("Todas")
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
