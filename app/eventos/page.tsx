"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Baby,
  BookOpen,
  Dumbbell,
  Palette,
  ChefHat,
  Star,
  Filter,
  CalendarDays,
} from "lucide-react"

const events = []

const categories = [
  { name: "Todos", icon: <Calendar className="h-4 w-4" />, count: 0 },
  { name: "Lactancia", icon: <Baby className="h-4 w-4" />, count: 0 },
  { name: "Bienestar", icon: <Dumbbell className="h-4 w-4" />, count: 0 },
  { name: "Educación", icon: <BookOpen className="h-4 w-4" />, count: 0 },
  { name: "Alimentación", icon: <ChefHat className="h-4 w-4" />, count: 0 },
  { name: "Apoyo Emocional", icon: <Heart className="h-4 w-4" />, count: 0 },
  { name: "Creatividad", icon: <Palette className="h-4 w-4" />, count: 0 },
]

const eventTypes = ["Todos", "Taller", "Charla", "Webinar", "Clase", "Grupo de Apoyo"]
const priceRanges = ["Todos", "Gratis", "€1-20", "€21-50", "€50+"]
const locations = ["Todos", "Madrid", "Barcelona", "Valencia", "Sevilla", "Online"]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedType, setSelectedType] = useState("Todos")
  const [selectedPrice, setSelectedPrice] = useState("Todos")
  const [selectedLocation, setSelectedLocation] = useState("Todos")
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { user } = useAuth()

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory
    const matchesType = selectedType === "Todos" || event.type === selectedType
    const matchesLocation =
      selectedLocation === "Todos" ||
      (selectedLocation === "Online" && event.isOnline) ||
      event.address.includes(selectedLocation)

    const matchesPrice =
      selectedPrice === "Todos" ||
      (selectedPrice === "Gratis" && event.isFree) ||
      (selectedPrice === "€1-20" && event.price > 0 && event.price <= 20) ||
      (selectedPrice === "€21-50" && event.price > 20 && event.price <= 50) ||
      (selectedPrice === "€50+" && event.price > 50)

    return matchesSearch && matchesCategory && matchesType && matchesLocation && matchesPrice
  })

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat?.icon || <Calendar className="h-4 w-4" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Eventos y Talleres</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre talleres, charlas y actividades diseñadas especialmente para madres y familias
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedPrice === "Gratis" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedPrice(selectedPrice === "Gratis" ? "Todos" : "Gratis")}
                  >
                    Eventos Gratuitos
                  </Badge>
                  <Badge
                    variant={selectedLocation === "Online" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedLocation(selectedLocation === "Online" ? "Todos" : "Online")}
                  >
                    Online
                  </Badge>
                  <Badge
                    variant={selectedType === "Taller" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedType(selectedType === "Taller" ? "Todos" : "Taller")}
                  >
                    Talleres
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Precio" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((price) => (
                          <SelectItem key={price} value={price}>
                            {price}
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

                    <div className="flex space-x-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1"
                      >
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1"
                      >
                        Lista
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <Badge className={event.isFree ? "bg-green-500" : "bg-blue-500"}>
                        {event.isFree ? "Gratis" : `€${event.price}`}
                      </Badge>
                      {event.isOnline && <Badge variant="secondary">Online</Badge>}
                      {event.isPopular && <Badge className="bg-red-500">Popular</Badge>}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs mb-2">
                        {getCategoryIcon(event.category)}
                        <span className="ml-1">{event.category}</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {event.time} ({event.duration})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {event.currentAttendees}/{event.maxAttendees} inscritas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {renderStars(event.rating)}
                        <span className="text-xs text-gray-500">({event.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{event.organizer.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{event.organizer.name}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        className="bg-indigo-500 hover:bg-indigo-600"
                        disabled={event.currentAttendees >= event.maxAttendees}
                      >
                        {event.currentAttendees >= event.maxAttendees ? "Completo" : "Inscribirse"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aún no hay eventos programados.</p>
                  <p className="text-gray-400 text-sm mt-2">Los eventos aparecerán aquí una vez que se publiquen.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
