"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Star,
  Award,
  Clock,
  DollarSign,
  User,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import type { Professional } from "@/types"

interface Props {
  params: {
    id: string
  }
}

export default function ViewProfessionalPage({ params }: Props) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loadingProfessional, setLoadingProfessional] = useState(true)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (user && isAdmin && params.id) {
      loadProfessional()
    }
  }, [user, isAdmin, params.id])

  const loadProfessional = async () => {
    try {
      const docRef = doc(db, "professionals", params.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setProfessional({
          id: docSnap.id,
          ...docSnap.data(),
        } as Professional)
      } else {
        toast.error("Profesional no encontrado")
        router.push("/admin/profesionales")
      }
    } catch (error) {
      console.error("Error loading professional:", error)
      toast.error("Error al cargar el profesional")
    } finally {
      setLoadingProfessional(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha no disponible"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      Lactancia: "bg-blue-100 text-blue-800",
      Psicología: "bg-green-100 text-green-800",
      Nutrición: "bg-orange-100 text-orange-800",
      Pediatría: "bg-purple-100 text-purple-800",
      Ginecología: "bg-pink-100 text-pink-800",
      Fisioterapia: "bg-indigo-100 text-indigo-800",
      Doula: "bg-yellow-100 text-yellow-800",
    }
    return colors[specialty] || "bg-gray-100 text-gray-800"
  }

  if (loading || loadingProfessional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando profesional...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin || !professional) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/profesionales">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
              <p className="text-gray-600 mt-1">{professional.title}</p>
            </div>
          </div>
          <Link href={`/admin/profesionales/editar/${professional.id}`}>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nombre Completo</p>
                    <p className="text-gray-900">{professional.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Título Profesional</p>
                    <p className="text-gray-900">{professional.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </p>
                    <p className="text-gray-900">{professional.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Teléfono
                    </p>
                    <p className="text-gray-900">{professional.phone || "No especificado"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Ubicación
                  </p>
                  <p className="text-gray-900">{professional.location}</p>
                  {professional.address && <p className="text-sm text-gray-600 mt-1">{professional.address}</p>}
                </div>

                {professional.bio && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Biografía</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{professional.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Años de Experiencia</p>
                    <p className="text-gray-900">{professional.experience} años</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Rating
                    </p>
                    <p className="text-gray-900">
                      {professional.rating?.toFixed(1) || "0.0"} ({professional.reviewCount || 0} reseñas)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty) => (
                    <Badge key={specialty} className={getSpecialtyColor(specialty)}>
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Educación y Certificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Educación y Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {professional.education.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Educación</p>
                    <div className="space-y-2">
                      {professional.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-900">{edu}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {professional.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Certificaciones</p>
                    <div className="space-y-2">
                      {professional.certifications.map((cert, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-900">{cert}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {professional.education.length === 0 && professional.certifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No hay información educativa registrada</p>
                )}
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            {(professional.socialMedia.website ||
              professional.socialMedia.instagram ||
              professional.socialMedia.facebook) && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {professional.socialMedia.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <a
                        href={professional.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {professional.socialMedia.website}
                      </a>
                    </div>
                  )}
                  {professional.socialMedia.instagram && (
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{professional.socialMedia.instagram}</span>
                    </div>
                  )}
                  {professional.socialMedia.facebook && (
                    <div className="flex items-center space-x-3">
                      <Facebook className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{professional.socialMedia.facebook}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge
                    variant={professional.isActive ? "default" : "secondary"}
                    className={professional.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {professional.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verificación</span>
                  <Badge
                    variant={professional.isVerified ? "default" : "secondary"}
                    className={professional.isVerified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                  >
                    {professional.isVerified ? "Verificado" : "No Verificado"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidad */}
            {professional.availability.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Disponibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.availability.map((day) => (
                      <Badge key={day} variant="outline">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tipos de Consulta */}
            {professional.consultationTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.consultationTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Idiomas */}
            {professional.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Idiomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Precios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Precios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Consulta Individual</span>
                  <span className="font-medium">
                    {professional.pricing.consultation > 0
                      ? `$${professional.pricing.consultation}`
                      : "No especificado"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taller Grupal</span>
                  <span className="font-medium">
                    {professional.pricing.workshop > 0 ? `$${professional.pricing.workshop}` : "No especificado"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visita a Domicilio</span>
                  <span className="font-medium">
                    {professional.pricing.homeVisit > 0 ? `$${professional.pricing.homeVisit}` : "No especificado"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Información de Creación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Fecha de Creación</p>
                  <p className="text-sm text-gray-900">{formatDate(professional.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Actualización</p>
                  <p className="text-sm text-gray-900">{formatDate(professional.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
