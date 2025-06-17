"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  MessageCircle,
  Coffee,
  TreePine,
  Baby,
  Car,
  Wifi,
  Utensils,
  Shield,
  Euro,
  Camera,
  Users,
  CheckCircle,
} from "lucide-react"

const places = []

const placeTypes = [
  "Todos",
  "Cafetería",
  "Parque",
  "Centro de juegos",
  "Biblioteca",
  "Piscina",
  "Granja escuela",
  "Restaurante",
]
const cities = ["Todas", "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"]
const priceRanges = ["Todos", "Gratis", "€", "€€", "€€€"]
const ageRanges = ["Todas", "0-2 años", "2-5 años", "5-8 años", "8+ años"]

export default function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("Todos")
  const [selectedCity, setSelectedCity] = useState("Todas")
  const [selectedPrice, setSelectedPrice] = useState("Todos")
  const [selectedAge, setSelectedAge] = useState("Todas")
  const [selectedPlace, setSelectedPlace] = useState<(typeof places)[0] | null>(null)
  const { user } = useAuth()

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "Todos" || place.type === selectedType
    const matchesCity = selectedCity === "Todas" || place.address.includes(selectedCity)
    const matchesPrice = selectedPrice === "Todos" || place.priceRange === selectedPrice
    const matchesAge = selectedAge === "Todas" || place.ageRange.includes(selectedAge.split("-")[0])

    return matchesSearch && matchesType && matchesCity && matchesPrice && matchesAge
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Cafetería":
        return <Coffee className="h-5 w-5" />
      case "Parque":
        return <TreePine className="h-5 w-5" />
      case "Centro de juegos":
        return <Baby className="h-5 w-5" />
      case "Biblioteca":
        return <MessageCircle className="h-5 w-5" />
      case "Piscina":
        return <Users className="h-5 w-5" />
      case "Granja escuela":
        return <TreePine className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lugares de Encuentro</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre espacios kid-friendly perfectos para conectar con otras familias y crear recuerdos especiales
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar lugares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de lugar" />
              </SelectTrigger>
              <SelectContent>
                {placeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-48">
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

            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger className="w-full md:w-32">
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

            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Edad" />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-gray-800">
                      {getTypeIcon(place.type)}
                      <span className="ml-1">{place.type}</span>
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{place.priceRange}</Badge>
                  </div>
                  {place.verified && (
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight">{place.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {renderStars(place.rating)}
                      <span className="text-sm font-medium">{place.rating}</span>
                      <span className="text-sm text-gray-500">({place.reviewCount})</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {place.ageRange}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{place.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{place.openingHours}</span>
                    </div>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex flex-wrap gap-2">
                    {place.amenities.wifi && <Wifi className="h-4 w-4 text-blue-500" aria-label="WiFi" />}
                    {place.amenities.parking && <Car className="h-4 w-4 text-green-500" aria-label="Aparcamiento" />}
                    {place.amenities.kidsMenu && (
                      <Utensils className="h-4 w-4 text-orange-500" aria-label="Menú infantil" />
                    )}
                    {place.amenities.playArea && (
                      <Baby className="h-4 w-4 text-purple-500" aria-label="Zona de juegos" />
                    )}
                    {place.amenities.breastfeeding && (
                      <Heart className="h-4 w-4 text-pink-500" aria-label="Lactancia" />
                    )}
                    {place.amenities.changingRoom && (
                      <Shield className="h-4 w-4 text-indigo-500" aria-label="Cambiador" />
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedPlace(place)}>
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {selectedPlace && <PlaceProfile place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <Phone className="h-4 w-4 mr-1" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aún no hay lugares registrados en la plataforma.</p>
              <p className="text-gray-400 text-sm mt-2">Los lugares aparecerán aquí una vez que se registren.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Place Profile Component
function PlaceProfile({ place, onClose }: { place: (typeof places)[0]; onClose: () => void }) {
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Cafetería":
        return <Coffee className="h-6 w-6" />
      case "Parque":
        return <TreePine className="h-6 w-6" />
      case "Centro de juegos":
        return <Baby className="h-6 w-6" />
      case "Biblioteca":
        return <MessageCircle className="h-6 w-6" />
      case "Piscina":
        return <Users className="h-6 w-6" />
      case "Granja escuela":
        return <TreePine className="h-6 w-6" />
      default:
        return <MapPin className="h-6 w-6" />
    }
  }

  const sampleReviews = [
    {
      id: 1,
      author: "Carmen M.",
      rating: 5,
      date: "Hace 1 semana",
      comment:
        "Lugar perfecto para ir con niños. El personal es muy atento y las instalaciones están impecables. Mi hija se lo pasó genial.",
    },
    {
      id: 2,
      author: "Laura P.",
      rating: 4,
      date: "Hace 2 semanas",
      comment:
        "Muy buen ambiente familiar. Los precios son razonables y hay muchas actividades para los peques. Volveremos seguro.",
    },
    {
      id: 3,
      author: "Ana S.",
      rating: 5,
      date: "Hace 1 mes",
      comment:
        "Excelente para conocer otras mamás. Organizan eventos muy chulos y siempre hay algo que hacer con los niños.",
    },
  ]

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">Detalles del Lugar</DialogTitle>
      </DialogHeader>

      {/* Image Gallery */}
      <div className="relative">
        <Image
          src={place.images[currentImageIndex] || "/placeholder.svg"}
          alt={place.name}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentImageIndex + 1} / {place.images.length}
        </div>
        <div className="flex justify-center mt-2 space-x-2">
          {place.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-green-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-green-100 rounded-full">{getTypeIcon(place.type)}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
          <p className="text-green-600 font-semibold text-lg">{place.type}</p>
          <div className="flex items-center space-x-4 mt-2">
            {renderStars(place.rating)}
            <span className="font-semibold">{place.rating}</span>
            <span className="text-gray-500">({place.reviewCount} reseñas)</span>
            <Badge className="bg-green-100 text-green-800">{place.priceRange}</Badge>
            {place.verified && (
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Descripción</h3>
        <p className="text-gray-600">{place.description}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Práctica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-3 text-gray-400" />
              <p>{place.address}</p>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-400" />
              <p>{place.phone}</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-3 text-gray-400" />
              <p>{place.openingHours}</p>
            </div>
            <div className="flex items-center">
              <Baby className="h-4 w-4 mr-3 text-gray-400" />
              <p>Edades: {place.ageRange}</p>
            </div>
            <div className="flex items-center">
              <Euro className="h-4 w-4 mr-3 text-gray-400" />
              <p>Precio: {place.priceRange}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Servicios y Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {place.features.map((feature) => (
                <div key={feature} className="flex items-center text-sm">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events */}
      {place.events.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Eventos y Actividades</h3>
          <div className="space-y-2">
            {place.events.map((event, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <Calendar className="h-4 w-4 mr-3 text-green-600" />
                <span className="text-sm">{event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reseñas ({place.reviewCount})</h3>
          {user && (
            <Button onClick={() => setShowReviewForm(!showReviewForm)} size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Escribir Reseña
            </Button>
          )}
        </div>

        {showReviewForm && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Tu puntuación</Label>
                  {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
                </div>
                <div>
                  <Label htmlFor="review-comment">Tu reseña</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Comparte tu experiencia en este lugar..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm">Publicar Reseña</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {sampleReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4 border-t">
        <Button className="flex-1 bg-green-500 hover:bg-green-600">
          <Phone className="h-4 w-4 mr-2" />
          Llamar
        </Button>
        <Button variant="outline" className="flex-1">
          <MapPin className="h-4 w-4 mr-2" />
          Cómo Llegar
        </Button>
        <Button variant="outline">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
