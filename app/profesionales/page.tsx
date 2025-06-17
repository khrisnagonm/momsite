"use client"

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
  Mail,
  Clock,
  Award,
  Heart,
  MessageCircle,
  Calendar,
  CheckCircle,
} from "lucide-react"

const professionals = [
  {
    id: 1,
    name: "Dra. María González Pérez",
    specialty: "Pediatría",
    subSpecialty: "Neonatología",
    rating: 4.9,
    reviewCount: 127,
    experience: "15 años",
    center: "Hospital Materno Infantil San Carlos",
    address: "Calle Princesa, 2, Madrid",
    phone: "+34 91 330 3000",
    email: "mgonzalez@hospital.com",
    image: "/placeholder.svg?height=150&width=150",
    verified: true,
    acceptsInsurance: ["Sanitas", "Adeslas", "DKV"],
    languages: ["Español", "Inglés"],
    schedule: "Lun-Vie 9:00-17:00",
    about:
      "Especialista en pediatría con más de 15 años de experiencia. Enfoque especial en el cuidado de recién nacidos y desarrollo infantil temprano.",
    education: ["Universidad Complutense de Madrid", "Hospital Gregorio Marañón"],
    services: ["Consultas pediátricas", "Vacunación", "Control del niño sano", "Urgencias pediátricas"],
  },
  {
    id: 2,
    name: "Dr. Carlos Ruiz Martín",
    specialty: "Ginecología",
    subSpecialty: "Obstetricia",
    rating: 4.8,
    reviewCount: 89,
    experience: "12 años",
    center: "Clínica Delfos",
    address: "Avda. de la Constitución, 15, Barcelona",
    phone: "+34 93 227 4700",
    email: "cruiz@clinicadelfos.com",
    image: "/placeholder.svg?height=150&width=150",
    verified: true,
    acceptsInsurance: ["Mapfre", "Sanitas", "Cigna"],
    languages: ["Español", "Catalán", "Francés"],
    schedule: "Lun-Jue 8:00-16:00",
    about:
      "Ginecólogo obstetra especializado en embarazo de alto riesgo y parto humanizado. Comprometido con el bienestar integral de la mujer.",
    education: ["Universidad de Barcelona", "Hospital Clínic Barcelona"],
    services: ["Control prenatal", "Ecografías 4D", "Parto natural", "Cesáreas", "Planificación familiar"],
  },
  {
    id: 3,
    name: "Dra. Ana López Silva",
    specialty: "Psicología",
    subSpecialty: "Psicología Perinatal",
    rating: 4.9,
    reviewCount: 156,
    experience: "10 años",
    center: "Centro de Psicología Maternal",
    address: "Calle Serrano, 45, Madrid",
    phone: "+34 91 435 2100",
    email: "alopez@psicomaternal.com",
    image: "/placeholder.svg?height=150&width=150",
    verified: true,
    acceptsInsurance: ["Adeslas", "DKV", "Asisa"],
    languages: ["Español", "Inglés"],
    schedule: "Lun-Vie 10:00-20:00",
    about:
      "Psicóloga especializada en maternidad, depresión postparto y vínculo materno-filial. Terapia individual y grupal.",
    education: ["Universidad Autónoma de Madrid", "Instituto Europeo de Psicología Perinatal"],
    services: ["Terapia individual", "Terapia de pareja", "Grupos de apoyo", "Preparación al parto"],
  },
  {
    id: 4,
    name: "Dra. Laura Martínez Vega",
    specialty: "Nutrición",
    subSpecialty: "Nutrición Infantil",
    rating: 4.7,
    reviewCount: 73,
    experience: "8 años",
    center: "Consulta Privada NutriKids",
    address: "Plaza Mayor, 12, Sevilla",
    phone: "+34 95 421 3456",
    email: "lmartinez@nutrikids.es",
    image: "/placeholder.svg?height=150&width=150",
    verified: true,
    acceptsInsurance: ["Sanitas", "Mapfre"],
    languages: ["Español"],
    schedule: "Mar-Sáb 9:00-14:00",
    about:
      "Nutricionista especializada en alimentación infantil, lactancia materna y introducción de alimentos complementarios.",
    education: ["Universidad de Sevilla", "Colegio Profesional de Dietistas-Nutricionistas"],
    services: ["Consultas nutricionales", "Planes alimentarios", "Asesoría en lactancia", "Talleres BLW"],
  },
  {
    id: 5,
    name: "Dr. Roberto Fernández",
    specialty: "Fisioterapia",
    subSpecialty: "Fisioterapia Pediátrica",
    rating: 4.6,
    reviewCount: 45,
    experience: "6 años",
    center: "FisioKids Valencia",
    address: "Calle Colón, 23, Valencia",
    phone: "+34 96 352 1789",
    email: "rfernandez@fisiokids.com",
    image: "/placeholder.svg?height=150&width=150",
    verified: true,
    acceptsInsurance: ["DKV", "Adeslas"],
    languages: ["Español", "Valenciano"],
    schedule: "Lun-Vie 16:00-20:00",
    about: "Fisioterapeuta especializado en desarrollo motor infantil, tortícolis congénita y estimulación temprana.",
    education: ["Universidad CEU Cardenal Herrera", "Formación en Bobath"],
    services: ["Fisioterapia pediátrica", "Estimulación temprana", "Tratamiento postural", "Asesoramiento familiar"],
  },
]

const specialties = [
  "Todas",
  "Pediatría",
  "Ginecología",
  "Psicología",
  "Nutrición",
  "Fisioterapia",
  "Dermatología",
  "Odontología",
]
const cities = ["Todas", "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"]
const ratings = ["Todas", "4.5+", "4.0+", "3.5+"]

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas")
  const [selectedCity, setSelectedCity] = useState("Todas")
  const [selectedRating, setSelectedRating] = useState("Todas")
  const [selectedProfessional, setSelectedProfessional] = useState<(typeof professionals)[0] | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const { user } = useAuth()

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.center.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = selectedSpecialty === "Todas" || professional.specialty === selectedSpecialty
    const matchesCity = selectedCity === "Todas" || professional.address.includes(selectedCity)
    const matchesRating =
      selectedRating === "Todas" ||
      (selectedRating === "4.5+" && professional.rating >= 4.5) ||
      (selectedRating === "4.0+" && professional.rating >= 4.0) ||
      (selectedRating === "3.5+" && professional.rating >= 3.5)

    return matchesSearch && matchesSpecialty && matchesCity && matchesRating
  })

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Profesionales de Confianza</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra especialistas verificados recomendados por nuestra comunidad de madres
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
                placeholder="Buscar por nombre, especialidad o centro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full md:w-48">
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

            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Puntuación" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Image
                        src={professional.image || "/placeholder.svg"}
                        alt={professional.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                      {professional.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{professional.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{professional.specialty}</p>
                      {professional.subSpecialty && (
                        <p className="text-sm text-gray-500">{professional.subSpecialty}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {renderStars(professional.rating)}
                      <span className="text-sm font-medium">{professional.rating}</span>
                      <span className="text-sm text-gray-500">({professional.reviewCount})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {professional.experience}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{professional.center}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{professional.schedule}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {professional.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedProfessional(professional)}
                        >
                          Ver Perfil
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {selectedProfessional && (
                          <ProfessionalProfile
                            professional={selectedProfessional}
                            onClose={() => setSelectedProfessional(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Phone className="h-4 w-4 mr-1" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProfessionals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron profesionales que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Professional Profile Component
function ProfessionalProfile({
  professional,
  onClose,
}: {
  professional: (typeof professionals)[0]
  onClose: () => void
}) {
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

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

  const sampleReviews = [
    {
      id: 1,
      author: "María S.",
      rating: 5,
      date: "Hace 2 semanas",
      comment: "Excelente profesional. Muy atenta y cariñosa con mi bebé. Resolvió todas mis dudas con paciencia.",
    },
    {
      id: 2,
      author: "Carmen L.",
      rating: 5,
      date: "Hace 1 mes",
      comment: "La recomiendo 100%. Su experiencia se nota y transmite mucha confianza. El trato es excepcional.",
    },
    {
      id: 3,
      author: "Ana R.",
      rating: 4,
      date: "Hace 2 meses",
      comment: "Muy buena profesional, aunque a veces hay que esperar un poco. Pero vale la pena por su calidad.",
    },
  ]

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">Perfil Profesional</DialogTitle>
      </DialogHeader>

      {/* Header */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <Image
            src={professional.image || "/placeholder.svg"}
            alt={professional.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          {professional.verified && (
            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{professional.name}</h2>
          <p className="text-blue-600 font-semibold text-lg">{professional.specialty}</p>
          {professional.subSpecialty && <p className="text-gray-600">{professional.subSpecialty}</p>}

          <div className="flex items-center space-x-4 mt-3">
            {renderStars(professional.rating)}
            <span className="font-semibold">{professional.rating}</span>
            <span className="text-gray-500">({professional.reviewCount} reseñas)</span>
            <Badge className="bg-green-100 text-green-800">
              <Award className="h-3 w-3 mr-1" />
              Verificado
            </Badge>
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sobre el profesional</h3>
        <p className="text-gray-600">{professional.about}</p>
      </div>

      {/* Contact & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">{professional.center}</p>
                <p className="text-sm text-gray-600">{professional.address}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-400" />
              <p>{professional.phone}</p>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-gray-400" />
              <p>{professional.email}</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-3 text-gray-400" />
              <p>{professional.schedule}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles Profesionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Experiencia</p>
              <p className="text-gray-600">{professional.experience}</p>
            </div>
            <div>
              <p className="font-medium">Idiomas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {professional.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Seguros Aceptados</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {professional.acceptsInsurance.map((insurance) => (
                  <Badge key={insurance} variant="secondary">
                    {insurance}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Servicios</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {professional.services.map((service) => (
            <Badge key={service} variant="outline" className="justify-center py-2">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reseñas ({professional.reviewCount})</h3>
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
                    placeholder="Comparte tu experiencia con este profesional..."
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
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
          <Phone className="h-4 w-4 mr-2" />
          Llamar Ahora
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Solicitar Cita
        </Button>
        <Button variant="outline">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
