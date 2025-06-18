"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Star, Search, Filter } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"

interface Event {
  id: string
  title: string
  description: string
  category: string
  type: string
  date: string
  time: string
  location: string
  price: number
  maxAttendees: number | null
  currentAttendees: number
  rating: number
  reviewCount: number
  isOnline: boolean
  isFree: boolean
  isPopular: boolean
  image?: string
  tags: string[]
}

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const categories = [
    "Lactancia",
    "Bienestar",
    "Educación",
    "Alimentación",
    "Apoyo Emocional",
    "Creatividad",
    "Salud",
    "Desarrollo Infantil",
  ]

  const eventTypes = ["Taller", "Charla", "Webinar", "Clase", "Grupo de Apoyo", "Conferencia"]

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedCategory, selectedType])

  const loadEvents = async () => {
    if (!db) return

    try {
      setLoading(true)
      // Solo obtener eventos activos
      const eventsQuery = query(collection(db, "events"), where("status", "==", "active"))
      const querySnapshot = await getDocs(eventsQuery)

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[]

      // Ordenar por fecha en el cliente
      const sortedEvents = eventsData.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`)
        const dateB = new Date(`${b.date} ${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })

      setEvents(sortedEvents)
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    // Filtrar por tipo
    if (selectedType !== "all") {
      filtered = filtered.filter((event) => event.type === selectedType)
    }

    setFilteredEvents(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // HH:MM
  }

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree || price === 0) return "Gratis"
    return `$${price.toLocaleString("es-CL")} CLP`
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      Lactancia: "🤱",
      Bienestar: "🧘‍♀️",
      Educación: "📚",
      Alimentación: "🍎",
      "Apoyo Emocional": "💝",
      Creatividad: "🎨",
      Salud: "🏥",
      "Desarrollo Infantil": "👶",
    }
    return emojiMap[category] || "✨"
  }

  const getTypeEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      Taller: "🛠️",
      Charla: "💬",
      Webinar: "💻",
      Clase: "📖",
      "Grupo de Apoyo": "🤗",
      Conferencia: "🎤",
    }
    return emojiMap[type] || "📅"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Eventos y Talleres</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre eventos diseñados especialmente para madres y familias
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
                    placeholder="Buscar eventos..."
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

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getTypeEmoji(type)} {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eventos */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos disponibles</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all" || selectedType !== "all"
                ? "No se encontraron eventos que coincidan con los filtros seleccionados."
                : "Aún no hay eventos programados. ¡Vuelve pronto para ver las novedades!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Imagen del evento */}
                <div className="relative h-48 bg-gray-200">
                  {event.image ? (
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {event.isPopular && <Badge className="absolute top-2 right-2 bg-pink-500">⭐ Popular</Badge>}
                  {event.isFree && <Badge className="absolute top-2 left-2 bg-green-500">🎁 Gratis</Badge>}
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {getCategoryEmoji(event.category)} {event.category}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeEmoji(event.type)} {event.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />{formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />{formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.isOnline ? "💻 Online" : `${event.location}`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />{" "}
                      {event.maxAttendees
                        ? `${event.currentAttendees}/${event.maxAttendees} asistentes`
                        : `${event.currentAttendees} asistentes`}
                    </div>
                    {event.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />⭐ {event.rating.toFixed(1)} (
                        {event.reviewCount} reseñas)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-pink-600">
                      {formatPrice(event.price, event.isFree)}
                    </span>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                      Ver Detalles
                    </Button>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          🏷️ {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          ➕ {event.tags.length - 3} más
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
