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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Mail,
  Globe,
  MapPin,
  Clock,
  Phone,
  DollarSign,
  Settings,
  X,
  ImageIcon,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { uploadEventImage } from "@/lib/firebase-storage"
import { toast } from "sonner"
import Image from "next/image"

const categories = [
  "Parque",
  "Cafetería",
  "Centro Comercial",
  "Biblioteca",
  "Centro Comunitario",
  "Restaurante",
  "Espacio Cultural",
  "Gimnasio",
  "Spa",
  "Centro de Salud",
]

const regionsAndCities = {
  "Región Metropolitana": [
    "Santiago",
    "Las Condes",
    "Providencia",
    "Ñuñoa",
    "La Reina",
    "Vitacura",
    "San Miguel",
    "Maipú",
    "Puente Alto",
    "La Florida",
    "Peñalolén",
    "Macul",
    "San Joaquín",
    "Pedro Aguirre Cerda",
    "Lo Barnechea",
    "Huechuraba",
    "Quilicura",
    "Renca",
    "Independencia",
    "Recoleta",
    "Conchalí",
    "Estación Central",
    "Cerrillos",
    "Lo Prado",
    "Quinta Normal",
    "Pudahuel",
    "Cerro Navia",
    "Lo Espejo",
    "San Ramón",
    "La Cisterna",
    "El Bosque",
    "La Granja",
    "San Bernardo",
    "Calera de Tango",
    "Buin",
    "Paine",
    "Melipilla",
    "Curacaví",
    "María Pinto",
    "Alhué",
    "San Pedro",
    "Talagante",
    "Peñaflor",
    "Isla de Maipo",
    "El Monte",
    "Padre Hurtado",
    "Pirque",
    "Colina",
    "Lampa",
    "Tiltil",
  ],
  "Región de Valparaíso": [
    "Valparaíso",
    "Viña del Mar",
    "Quilpué",
    "Villa Alemana",
    "Concón",
    "Casablanca",
    "San Antonio",
    "Cartagena",
    "El Quisco",
    "Algarrobo",
    "El Tabo",
    "Santo Domingo",
    "Quillota",
    "La Calera",
    "Hijuelas",
    "La Cruz",
    "Nogales",
    "San Felipe",
    "Los Andes",
    "Rinconada",
    "Calle Larga",
    "San Esteban",
    "Putaendo",
    "Santa María",
    "Panquehue",
    "Llaillay",
    "Catemu",
    "Petorca",
    "Cabildo",
    "Papudo",
    "Zapallar",
    "Puchuncaví",
    "Quintero",
    "Juan Fernández",
    "Isla de Pascua",
  ],
  "Región del Biobío": [
    "Concepción",
    "Talcahuano",
    "Chillán",
    "Los Ángeles",
    "Coronel",
    "San Pedro de la Paz",
    "Hualqui",
    "Tomé",
    "Penco",
    "Lota",
    "Chiguayante",
    "Florida",
    "Hualpén",
    "Santa Juana",
    "Laja",
    "Nacimiento",
    "Negrete",
    "Mulchén",
    "Quilaco",
    "Quilleco",
    "San Rosendo",
    "Yumbel",
    "Cabrero",
    "Tucapel",
    "Antuco",
    "El Carmen",
    "Pemuco",
    "Yungay",
    "Bulnes",
    "Quillón",
    "Ñiquén",
    "San Ignacio",
    "Cobquecura",
    "Quirihue",
    "Ninhue",
    "Trehuaco",
    "Coelemu",
    "Portezuelo",
    "Ránquil",
    "Coihueco",
    "Pinto",
    "San Fabián",
    "Ñiquen",
  ],
  "Región de Coquimbo": [
    "La Serena",
    "Coquimbo",
    "Ovalle",
    "Illapel",
    "Vicuña",
    "Andacollo",
    "Paihuano",
    "Monte Patria",
    "Combarbalá",
    "Punitaqui",
    "Río Hurtado",
    "Salamanca",
    "Los Vilos",
    "Canela",
  ],
  "Región de Antofagasta": [
    "Antofagasta",
    "Calama",
    "Tocopilla",
    "Mejillones",
    "Taltal",
    "San Pedro de Atacama",
    "Ollagüe",
    "María Elena",
    "Sierra Gorda",
  ],
  "Región de La Araucanía": [
    "Temuco",
    "Villarrica",
    "Pucón",
    "Angol",
    "Victoria",
    "Lautaro",
    "Nueva Imperial",
    "Carahue",
    "Saavedra",
    "Teodoro Schmidt",
    "Toltén",
    "Pitrufquén",
    "Gorbea",
    "Loncoche",
    "Freire",
    "Curarrehue",
    "Padre Las Casas",
    "Perquenco",
    "Galvarino",
    "Ercilla",
    "Collipulli",
    "Renaico",
    "Traiguén",
    "Lumaco",
    "Purén",
    "Los Sauces",
    "Curacautín",
    "Lonquimay",
    "Melipeuco",
    "Cunco",
  ],
  "Región del Libertador Bernardo O'Higgins": [
    "Rancagua",
    "Machalí",
    "Graneros",
    "Mostazal",
    "Codegua",
    "Requínoa",
    "Rengo",
    "Malloa",
    "Quinta de Tilcoco",
    "San Vicente",
    "Pichidegua",
    "Peumo",
    "Coltauco",
    "Doñihue",
    "Coinco",
    "Las Cabras",
    "San Fernando",
    "Chimbarongo",
    "Placilla",
    "Nancagua",
    "Chépica",
    "Santa Cruz",
    "Lolol",
    "Pumanque",
    "Palmilla",
    "Peralillo",
    "Navidad",
    "Litueche",
    "La Estrella",
    "Marchihue",
    "Paredones",
    "Pichilemu",
  ],
  "Región del Maule": [
    "Talca",
    "Curicó",
    "Linares",
    "Constitución",
    "Cauquenes",
    "Parral",
    "San Javier",
    "Villa Alegre",
    "Yerbas Buenas",
    "Maule",
    "Pelarco",
    "Río Claro",
    "San Clemente",
    "Pencahue",
    "Curepto",
    "Molina",
    "Sagrada Familia",
    "Hualañé",
    "Licantén",
    "Vichuquén",
    "Rauco",
    "Romeral",
    "Teno",
    "San Rafael",
    "Longaví",
    "Retiro",
    "Colbún",
    "Chanco",
    "Pelluhue",
    "Empedrado",
  ],
  "Región de Los Ríos": [
    "Valdivia",
    "La Unión",
    "Río Bueno",
    "Lago Ranco",
    "Futrono",
    "Lanco",
    "Máfil",
    "Mariquina",
    "Paillaco",
    "Corral",
    "Los Lagos",
    "Panguipulli",
  ],
  "Región de Los Lagos": [
    "Puerto Montt",
    "Castro",
    "Ancud",
    "Osorno",
    "Puerto Varas",
    "Frutillar",
    "Llanquihue",
    "Fresia",
    "Los Muermos",
    "Maullín",
    "Calbuco",
    "Cochamó",
    "Puqueldón",
    "Quinchao",
    "Curaco de Vélez",
    "Dalcahue",
    "Quemchi",
    "Queilén",
    "Quellón",
    "Chonchi",
    "Puqueldón",
    "San Juan",
    "San Pablo",
    "Río Negro",
    "Purranque",
    "Puyehue",
    "Entre Lagos",
    "Futaleufú",
    "Hualaihué",
    "Palena",
  ],
  "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara", "Colchane", "Camiña"],
  "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Región de Atacama": [
    "Copiapó",
    "Caldera",
    "Tierra Amarilla",
    "Chañaral",
    "Diego de Almagro",
    "Vallenar",
    "Freirina",
    "Huasco",
    "Alto del Carmen",
  ],
  "Región de Magallanes y Antártica Chilena": [
    "Punta Arenas",
    "Puerto Natales",
    "Porvenir",
    "Primavera",
    "Timaukel",
    "Río Verde",
    "Laguna Blanca",
    "San Gregorio",
    "Cabo de Hornos",
    "Antártica",
  ],
  "Región de Aysén": [
    "Coyhaique",
    "Puerto Aysén",
    "Chile Chico",
    "Cochrane",
    "Villa O'Higgins",
    "Cisnes",
    "Guaitecas",
    "Lago Verde",
    "Río Ibáñez",
    "Tortel",
  ],
}

const amenitiesOptions = [
  "Cambiador de bebés",
  "Área de lactancia",
  "WiFi gratuito",
  "Estacionamiento",
  "Acceso para sillas de ruedas",
  "Área de juegos",
  "Menú infantil",
  "Tronas disponibles",
  "Espacio para cochecitos",
  "Baños familiares",
  "Área verde",
  "Zona tranquila",
  "Aire acondicionado",
  "Calefacción",
]

const daysOfWeek = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
]

export default function NuevoLugarPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    region: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    isAccessible: false,
    isVerified: false,
    isActive: true,
    isFree: true,
    price: 0,
  })

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [hours, setHours] = useState<{ [key: string]: { open: string; close: string; closed: boolean } }>({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "10:00", close: "16:00", closed: true },
  })

  // Image upload state - USANDO LA MISMA LÓGICA QUE EVENTOS
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Available cities based on selected region
  const availableCities = formData.region
    ? regionsAndCities[formData.region as keyof typeof regionsAndCities] || []
    : []

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }

      // Reset city when region changes
      if (field === "region") {
        newData.city = ""
      }

      return newData
    })
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleHourChange = (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  // USANDO LA MISMA LÓGICA QUE EVENTOS PARA IMÁGENES
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validar cada archivo
    for (const file of files) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona solo archivos de imagen válidos.")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Las imágenes deben ser menores a 5MB.")
        return
      }
    }

    setImageFiles((prev) => [...prev, ...files])

    // Crear previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category || !formData.region || !formData.city) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    if (!user) {
      toast.error("Usuario no autenticado")
      return
    }

    setSaving(true)

    try {
      let imageUrls: string[] = []

      // Subir imágenes si hay alguna seleccionada - USANDO LA MISMA FUNCIÓN QUE EVENTOS
      if (imageFiles.length > 0) {
        setUploadingImage(true)
        try {
          const uploadPromises = imageFiles.map(async (file) => {
            return await uploadEventImage(file) // USANDO LA MISMA FUNCIÓN QUE FUNCIONA
          })

          imageUrls = await Promise.all(uploadPromises)
          toast.success(`${imageUrls.length} imagen(es) subida(s) correctamente`)
        } catch (error) {
          console.error("Error uploading images:", error)
          toast.error(
            error instanceof Error ? error.message : "Error al subir las imágenes. El lugar se creará sin imágenes.",
          )
        } finally {
          setUploadingImage(false)
        }
      }

      const placeData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        region: formData.region,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        rating: 0,
        reviewCount: 0,
        isAccessible: formData.isAccessible,
        isVerified: formData.isVerified,
        isActive: formData.isActive,
        isFree: formData.isFree,
        price: formData.isFree ? 0 : formData.price,
        amenities: selectedAmenities,
        hours,
        images: imageUrls, // Usar las URLs subidas
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      }

      const collectionRef = collection(db, "places")
      await addDoc(collectionRef, placeData)

      toast.success("Lugar agregado correctamente")
      router.push("/admin/lugares")
    } catch (error) {
      console.error("Error adding place:", error)
      const errorMessage = error instanceof Error ? error.message : "Error al agregar el lugar"
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
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/admin/lugares">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Lugar</h1>
            <p className="text-gray-600">Agrega un nuevo lugar de encuentro para la comunidad</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Información Básica */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Lugar *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Café Mamá & Bebé"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe el lugar y por qué es ideal para madres..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="region">Región *</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una región" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(regionsAndCities).map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">Comuna *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleInputChange("city", value)}
                      disabled={!formData.region}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={formData.region ? "Selecciona una comuna" : "Primero selecciona región"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Av. Providencia 123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes - USANDO LA MISMA LÓGICA QUE EVENTOS */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <ImageIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Imágenes del Lugar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Imágenes del Lugar</Label>
                  <div className="mt-2">
                    {imagePreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={preview || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <div className="text-center">
                            <Label htmlFor="additional-images" className="cursor-pointer">
                              <span className="text-sm font-medium text-gray-900">Agregar más imágenes</span>
                            </Label>
                            <Input
                              id="additional-images"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => document.getElementById("additional-images")?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Agregar Imágenes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Subir imágenes del lugar
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF hasta 5MB cada una</span>
                            </Label>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Seleccionar Imágenes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comodidades */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <div className="w-5 h-5 mr-2 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Comodidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedAmenities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Comodidades seleccionadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Horarios */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Horarios de Funcionamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-20">
                      <Label className="text-sm font-medium">{day.label}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${day.key}-closed`}
                        checked={hours[day.key]?.closed || false}
                        onCheckedChange={(checked) => handleHourChange(day.key, "closed", checked)}
                      />
                      <Label htmlFor={`${day.key}-closed`} className="text-sm">
                        Cerrado
                      </Label>
                    </div>
                    {!hours[day.key]?.closed && (
                      <>
                        <Input
                          type="time"
                          value={hours[day.key]?.open || "09:00"}
                          onChange={(e) => handleHourChange(day.key, "open", e.target.value)}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-500">a</span>
                        <Input
                          type="time"
                          value={hours[day.key]?.close || "18:00"}
                          onChange={(e) => handleHourChange(day.key, "close", e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@lugar.com"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Sitio Web
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Precio */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Precio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFree"
                    checked={formData.isFree}
                    onCheckedChange={(checked) => handleInputChange("isFree", checked)}
                  />
                  <Label htmlFor="isFree">Lugar gratuito</Label>
                </div>
                {!formData.isFree && (
                  <div>
                    <Label htmlFor="price">Precio promedio (CLP)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                      placeholder="15000"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estado */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  Estado del Lugar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Lugar Activo</Label>
                    <p className="text-sm text-gray-500">El lugar aparecerá en las búsquedas públicas</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isAccessible">Accesible</Label>
                    <p className="text-sm text-gray-500">Lugar accesible para personas con discapacidad</p>
                  </div>
                  <Switch
                    id="isAccessible"
                    checked={formData.isAccessible}
                    onCheckedChange={(checked) => handleInputChange("isAccessible", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isVerified">Lugar Verificado</Label>
                    <p className="text-sm text-gray-500">Marca el lugar como verificado por el equipo</p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => handleInputChange("isVerified", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link href="/admin/lugares">
              <Button variant="outline" disabled={saving}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving || uploadingImage} className="bg-pink-500 hover:bg-pink-600">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : uploadingImage ? (
                "Subiendo imágenes..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Lugar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
