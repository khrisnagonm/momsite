"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, Save, X, Plus, Trash2, User, Mail, Award, Clock, DollarSign, Globe } from "lucide-react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface Professional {
  id: string
  name: string
  title: string
  specialties: string[]
  email: string
  phone: string
  location: string
  address: string
  bio: string
  experience: number
  rating: number
  reviewCount: number
  isVerified: boolean
  isActive: boolean
  availability: string[]
  consultationTypes: string[]
  pricing: {
    consultation: number
    workshop: number
    homeVisit: number
  }
  education: string[]
  certifications: string[]
  languages: string[]
  socialMedia: {
    website?: string
    instagram?: string
    facebook?: string
  }
  createdAt: any
  updatedAt: any
  createdBy: string
}

const SPECIALTY_OPTIONS = [
  "Lactancia",
  "Psicología",
  "Nutrición",
  "Pediatría",
  "Ginecología",
  "Fisioterapia",
  "Doula",
  "Matrona",
  "Psiquiatría",
  "Terapia Ocupacional",
]

const AVAILABILITY_OPTIONS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const CONSULTATION_TYPES = ["Presencial", "Online", "Domicilio", "Taller Grupal", "Consulta Telefónica"]

const LANGUAGE_OPTIONS = ["Español", "Inglés", "Francés", "Portugués", "Italiano", "Alemán"]

export default function EditProfessionalPage({ params }: { params: { id: string } }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loadingProfessional, setLoadingProfessional] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    bio: "",
    experience: 0,
    isVerified: false,
    isActive: true,
    consultationPrice: 0,
    workshopPrice: 0,
    homeVisitPrice: 0,
    website: "",
    instagram: "",
    facebook: "",
  })

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [selectedConsultationTypes, setSelectedConsultationTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [education, setEducation] = useState<string[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [newEducation, setNewEducation] = useState("")
  const [newCertification, setNewCertification] = useState("")

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
      const professionalDoc = await getDoc(doc(db, "professionals", params.id))

      if (professionalDoc.exists()) {
        const professionalData = { id: professionalDoc.id, ...professionalDoc.data() } as Professional
        setProfessional(professionalData)

        // Pre-llenar el formulario
        setFormData({
          name: professionalData.name || "",
          title: professionalData.title || "",
          email: professionalData.email || "",
          phone: professionalData.phone || "",
          location: professionalData.location || "",
          address: professionalData.address || "",
          bio: professionalData.bio || "",
          experience: professionalData.experience || 0,
          isVerified: professionalData.isVerified || false,
          isActive: professionalData.isActive !== false,
          consultationPrice: professionalData.pricing?.consultation || 0,
          workshopPrice: professionalData.pricing?.workshop || 0,
          homeVisitPrice: professionalData.pricing?.homeVisit || 0,
          website: professionalData.socialMedia?.website || "",
          instagram: professionalData.socialMedia?.instagram || "",
          facebook: professionalData.socialMedia?.facebook || "",
        })

        setSelectedSpecialties(professionalData.specialties || [])
        setSelectedAvailability(professionalData.availability || [])
        setSelectedConsultationTypes(professionalData.consultationTypes || [])
        setSelectedLanguages(professionalData.languages || [])
        setEducation(professionalData.education || [])
        setCertifications(professionalData.certifications || [])
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const handleAvailabilityToggle = (day: string) => {
    setSelectedAvailability((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleConsultationTypeToggle = (type: string) => {
    setSelectedConsultationTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation((prev) => [...prev, newEducation.trim()])
      setNewEducation("")
    }
  }

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications((prev) => [...prev, newCertification.trim()])
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || selectedSpecialties.length === 0) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setSaving(true)

    try {
      const updateData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        specialties: selectedSpecialties,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        bio: formData.bio.trim(),
        experience: Number(formData.experience),
        isVerified: formData.isVerified,
        isActive: formData.isActive,
        availability: selectedAvailability,
        consultationTypes: selectedConsultationTypes,
        pricing: {
          consultation: Number(formData.consultationPrice),
          workshop: Number(formData.workshopPrice),
          homeVisit: Number(formData.homeVisitPrice),
        },
        education,
        certifications,
        languages: selectedLanguages,
        socialMedia: {
          website: formData.website.trim(),
          instagram: formData.instagram.trim(),
          facebook: formData.facebook.trim(),
        },
        updatedAt: new Date(),
        updatedBy: user.uid,
      }

      await updateDoc(doc(db, "professionals", params.id), updateData)

      toast.success("Profesional actualizado correctamente")
      router.push("/admin/profesionales")
    } catch (error) {
      console.error("Error updating professional:", error)
      toast.error("Error al actualizar el profesional")
    } finally {
      setSaving(false)
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Editar Profesional</h1>
              <p className="text-gray-600 mt-1">Actualiza la información del profesional</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Dra. María García"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Título Profesional *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ej: Especialista en Lactancia Materna"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Especialidades *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={selectedSpecialties.includes(specialty)}
                        onCheckedChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <Label htmlFor={specialty} className="text-sm">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSpecialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                        <button
                          type="button"
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Describe la experiencia y enfoque profesional..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="experience">Años de Experiencia</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Ej: 5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="profesional@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Ciudad</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Santiago, Chile"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Av. Providencia 123, Oficina 45"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disponibilidad y Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Disponibilidad y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Días Disponibles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {AVAILABILITY_OPTIONS.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={selectedAvailability.includes(day)}
                        onCheckedChange={() => handleAvailabilityToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tipos de Consulta</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {CONSULTATION_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedConsultationTypes.includes(type)}
                        onCheckedChange={() => handleConsultationTypeToggle(type)}
                      />
                      <Label htmlFor={type} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Idiomas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={() => handleLanguageToggle(language)}
                      />
                      <Label htmlFor={language} className="text-sm">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Precios (CLP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="consultationPrice">Consulta Individual</Label>
                  <Input
                    id="consultationPrice"
                    type="number"
                    min="0"
                    value={formData.consultationPrice}
                    onChange={(e) => handleInputChange("consultationPrice", e.target.value)}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="workshopPrice">Taller Grupal</Label>
                  <Input
                    id="workshopPrice"
                    type="number"
                    min="0"
                    value={formData.workshopPrice}
                    onChange={(e) => handleInputChange("workshopPrice", e.target.value)}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label htmlFor="homeVisitPrice">Visita a Domicilio</Label>
                  <Input
                    id="homeVisitPrice"
                    type="number"
                    min="0"
                    value={formData.homeVisitPrice}
                    onChange={(e) => handleInputChange("homeVisitPrice", e.target.value)}
                    placeholder="70000"
                  />
                </div>
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
              <div>
                <Label>Educación</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="Ej: Universidad de Chile - Medicina"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
                  />
                  <Button type="button" onClick={addEducation} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {education.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {education.map((edu, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm">{edu}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Certificaciones</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Ej: IBCLC - Consultora Internacional en Lactancia"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {certifications.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm">{cert}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Redes Sociales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                    placeholder="Página de Facebook"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Profesional Activo</Label>
                    <p className="text-sm text-gray-500">El profesional aparecerá en las búsquedas públicas</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isVerified">Profesional Verificado</Label>
                    <p className="text-sm text-gray-500">Marca al profesional como verificado por el equipo</p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => handleInputChange("isVerified", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/admin/profesionales">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="bg-pink-500 hover:bg-pink-600">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Profesional
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
