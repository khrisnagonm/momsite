"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Star, Search, Filter, Heart, Sparkles } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container px-4 py-8">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-pink-400 animate-pulse" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">✨ Cargando eventos mágicos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container px-4 py-8">
        {/* Header Mágico */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-pink-500 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Eventos y Talleres
            </h1>
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ✨ Descubre experiencias mágicas diseñadas especialmente para madres y familias 💖
          </p>
        </div>

        {/* Filtros Hermosos */}
        <div className="mb-10">
          <Card className="backdrop-blur-sm bg-white/70 border-pink-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
                    <Input
                      placeholder="🔍 Buscar eventos mágicos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/80"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-56 h-12 border-pink-200 focus:border-pink-400 bg-white/80">
                      <Filter className="h-4 w-4 mr-2 text-pink-400" />
                      <SelectValue placeholder="✨ Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🌟 Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryEmoji(category)} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-56 h-12 border-pink-200 focus:border-pink-400 bg-white/80">
                      <SelectValue placeholder="📅 Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🎯 Todos los tipos</SelectItem>
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
        </div>

        {/* Eventos */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/70 border-pink-200 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Calendar className="mx-auto h-16 w-16 text-pink-300 mb-4" />
                  <Sparkles className="mx-auto h-8 w-8 text-purple-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">✨ No hay eventos disponibles</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== "all" || selectedType !== "all"
                    ? "🔍 No se encontraron eventos que coincidan con los filtros seleccionados."
                    : "🌟 Aún no hay eventos programados. ¡Vuelve pronto para ver las novedades mágicas!"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/80 border-pink-200 hover:border-pink-300 hover:scale-105"
              >
                {/* Imagen del evento */}
                <div className="relative h-52 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                  {event.image ? (
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 text-pink-300 mx-auto mb-2" />
                        <Sparkles className="h-6 w-6 text-purple-400 mx-auto animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Badges flotantes */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {event.isPopular && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
                        ⭐ Popular
                      </Badge>
                    )}
                    {event.isFree && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                        🎁 Gratis
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200"
                      >
                        {getCategoryEmoji(event.category)} {event.category}
                      </Badge>
                      <Badge variant="outline" className="border-purple-200 text-purple-600">
                        {getTypeEmoji(event.type)} {event.type}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-3 text-pink-400" />
                      <span className="font-medium">📅 {formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-3 text-purple-400" />
                      <span className="font-medium">⏰ {formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-indigo-400" />
                      <span className="font-medium">{event.isOnline ? "💻 Online" : `📍 ${event.location}`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-3 text-green-400" />
                      <span className="font-medium">
                        👥{" "}
                        {event.maxAttendees
                          ? `${event.currentAttendees}/${event.maxAttendees} asistentes`
                          : `${event.currentAttendees} asistentes`}
                      </span>
                    </div>
                    {event.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          ⭐ {event.rating.toFixed(1)} ({event.reviewCount} reseñas)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      💰 {formatPrice(event.price, event.isFree)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      ✨ Ver Detalles
                    </Button>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-pink-200 text-pink-600 bg-pink-50">
                          🏷️ {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-purple-50">
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
