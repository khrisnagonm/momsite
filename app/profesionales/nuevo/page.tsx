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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, X, Save, User, MapPin, Award, DollarSign, Globe, Instagram, Facebook } from "lucide-react"
import Link from "next/link"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getDb } from "@/lib/firebase"
import { toast } from "sonner"

const specialtyOptions = [
  "Lactancia",
  "Psicología",
  "Nutrición",
  "Pediatría",
  "Ginecología",
  "Fisioterapia",
  "Doula",
  "Obstetricia",
  "Psicología Perinatal",
  "Terapia Familiar",
  "Yoga Prenatal",
  "Pilates",
  "Masaje Terapéutico",
]

const locationOptions = ["CABA", "Zona Norte", "Zona Oeste", "Zona Sur", "La Plata", "Online"]

const availabilityOptions = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const consultationTypeOptions = ["Presencial", "Online", "Domicilio", "Grupal"]

const languageOptions = ["Español", "Inglés", "Portugués", "Italiano", "Francés"]

export default function NewProfessionalPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Form state
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
    website: "",
    instagram: "",
    facebook: "",
    consultation: 0,
    workshop: 0,
    homeVisit: 0,
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item))
    } else {
      setArray([...array, item])
    }
  }

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation([...education, newEducation.trim()])
      setNewEducation("")
    }
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()])
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || selectedSpecialties.length === 0) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    if (!user) {
      toast.error("Usuario no autenticado")
      return
    }

    setSaving(true)

    try {
      const db = getDb()

      const professionalData = {
        name: formData.name,
        title: formData.title,
        specialties: selectedSpecialties,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        address: formData.address,
        bio: formData.bio,
        experience: formData.experience,
        rating: 0,
        reviewCount: 0,
        isVerified: formData.isVerified,
        isActive: formData.isActive,
        availability: selectedAvailability,
        consultationTypes: selectedConsultationTypes,
        pricing: {
          consultation: formData.consultation,
          workshop: formData.workshop,
          homeVisit: formData.homeVisit,
        },
        education,
        certifications,
        languages: selectedLanguages,
        socialMedia: {
          website: formData.website || undefined,
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      }

      const collectionRef = collection(db, "professionals")
      await addDoc(collectionRef, professionalData)

      toast.success("Profesional agregado correctamente")
      router.push("/admin/profesionales")
    } catch (error) {
      console.error("Error adding professional:", error)
      const errorMessage = error instanceof Error ? error.message : "Error al agregar el profesional"
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
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
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Profesional</h1>
              <p className="text-gray-600 mt-1">Agrega un nuevo profesional al directorio</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Básica */}
            <div className="lg:col-span-2 space-y-6">
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
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ej: María García"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Título Profesional *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Ej: Consultora en Lactancia"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="profesional@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Describe la experiencia y enfoque del profesional..."
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
                      onChange={(e) => handleInputChange("experience", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Especialidades */}
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={selectedSpecialties.includes(specialty)}
                          onCheckedChange={() =>
                            toggleArrayItem(selectedSpecialties, setSelectedSpecialties, specialty)
                          }
                        />
                        <Label htmlFor={specialty} className="text-sm">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSpecialties.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Especialidades seleccionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Zona de Atención</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección (Opcional)</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Dirección del consultorio"
                    />
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
                  {/* Educación */}
                  <div>
                    <Label>Educación</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        value={newEducation}
                        onChange={(e) => setNewEducation(e.target.value)}
                        placeholder="Ej: Licenciatura en Psicología - UBA"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
                      />
                      <Button type="button" onClick={addEducation} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {education.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {education.map((edu, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{edu}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Certificaciones */}
                  <div>
                    <Label>Certificaciones</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Ej: Certificación IBCLC"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                      />
                      <Button type="button" onClick={addCertification} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {certifications.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{cert}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Profesional Activo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVerified"
                      checked={formData.isVerified}
                      onCheckedChange={(checked) => handleInputChange("isVerified", checked)}
                    />
                    <Label htmlFor="isVerified">Profesional Verificado</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Disponibilidad */}
              <Card>
                <CardHeader>
                  <CardTitle>Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availabilityOptions.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={selectedAvailability.includes(day)}
                          onCheckedChange={() => toggleArrayItem(selectedAvailability, setSelectedAvailability, day)}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tipos de Consulta */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consultationTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedConsultationTypes.includes(type)}
                          onCheckedChange={() =>
                            toggleArrayItem(selectedConsultationTypes, setSelectedConsultationTypes, type)
                          }
                        />
                        <Label htmlFor={type} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Idiomas */}
              <Card>
                <CardHeader>
                  <CardTitle>Idiomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {languageOptions.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={() => toggleArrayItem(selectedLanguages, setSelectedLanguages, language)}
                        />
                        <Label htmlFor={language} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Precios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Precios (ARS)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="consultation">Consulta Individual</Label>
                    <Input
                      id="consultation"
                      type="number"
                      min="0"
                      value={formData.consultation}
                      onChange={(e) => handleInputChange("consultation", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workshop">Taller Grupal</Label>
                    <Input
                      id="workshop"
                      type="number"
                      min="0"
                      value={formData.workshop}
                      onChange={(e) => handleInputChange("workshop", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="homeVisit">Visita a Domicilio</Label>
                    <Input
                      id="homeVisit"
                      type="number"
                      min="0"
                      value={formData.homeVisit}
                      onChange={(e) => handleInputChange("homeVisit", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Redes Sociales */}
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="website" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Sitio Web
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      placeholder="@usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook" className="flex items-center">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="Usuario de Facebook"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link href="/admin/profesionales">
              <Button variant="outline" disabled={saving}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="bg-pink-500 hover:bg-pink-600">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Profesional
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
