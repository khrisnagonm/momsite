"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { uploadEventImage } from "@/lib/firebase-storage"
import { ArrowLeft, Plus, X, Upload, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NuevoEventoPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    address: "",
    price: 0,
    hasLimitedCapacity: false,
    maxAttendees: 0,
    isOnline: false,
    isFree: false,
    isPopular: false,
    image: "",
    organizer: {
      name: "",
      title: "",
      bio: "",
    },
    requirements: [] as string[],
    includes: [] as string[],
  })

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

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido.",
          variant: "destructive",
        })
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB.",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addListItem = (field: "requirements" | "includes", value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
    }
  }

  const removeListItem = (field: "requirements" | "includes", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isAdmin) return

    setLoading(true)
    try {
      let imageUrl = formData.image

      // Subir imagen si hay una seleccionada
      if (imageFile) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadEventImage(imageFile)
          toast({
            title: "Imagen subida",
            description: "La imagen se ha subido correctamente.",
          })
        } catch (error) {
          console.error("Error uploading image:", error)
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Error al subir la imagen. El evento se creará sin imagen.",
            variant: "destructive",
          })
        } finally {
          setUploadingImage(false)
        }
      }

      const eventData = {
        ...formData,
        image: imageUrl,
        tags,
        currentAttendees: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        createdBy: user.uid,
        status: "active",
        // Si no tiene cupos limitados, no guardar maxAttendees
        maxAttendees: formData.hasLimitedCapacity ? formData.maxAttendees : null,
      }

      // Remover el campo hasLimitedCapacity del objeto final
      delete eventData.hasLimitedCapacity

      await addDoc(collection(db, "events"), eventData)

      toast({
        title: "Evento creado",
        description: "El evento se ha creado exitosamente.",
      })

      router.push("/admin/eventos")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Hubo un error al crear el evento.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !isAdmin) {
    return <div>No tienes permisos para acceder a esta página.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/eventos" className="inline-flex items-center text-pink-600 hover:text-pink-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Eventos
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear Nuevo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen del Evento */}
              <div>
                <Label>Imagen del Evento</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Subir imagen del evento
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF hasta 5MB</span>
                          </Label>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
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
                          Seleccionar Imagen
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título del Evento *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
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

                  <div>
                    <Label htmlFor="type">Tipo de Evento *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Hora *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      placeholder="ej: 2 horas"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción Corta *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Descripción Completa</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  rows={5}
                />
              </div>

              {/* Ubicación y Precio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Lugar *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price">Precio (CLP)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                    />
                  </div>

                  {/* Cupos Limitados */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasLimitedCapacity"
                        checked={formData.hasLimitedCapacity}
                        onCheckedChange={(checked) => handleInputChange("hasLimitedCapacity", checked)}
                      />
                      <Label htmlFor="hasLimitedCapacity">Cupos Limitados</Label>
                    </div>

                    {formData.hasLimitedCapacity && (
                      <div>
                        <Label htmlFor="maxAttendees">Máximo de Asistentes</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          min="1"
                          value={formData.maxAttendees}
                          onChange={(e) => handleInputChange("maxAttendees", Number(e.target.value))}
                          placeholder="Ingresa el número máximo"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOnline"
                    checked={formData.isOnline}
                    onCheckedChange={(checked) => handleInputChange("isOnline", checked)}
                  />
                  <Label htmlFor="isOnline">Evento Online</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFree"
                    checked={formData.isFree}
                    onCheckedChange={(checked) => handleInputChange("isFree", checked)}
                  />
                  <Label htmlFor="isFree">Evento Gratuito</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                  <Label htmlFor="isPopular">Evento Popular</Label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Agregar tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Organizador */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Organizador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizer.name">Nombre del Organizador</Label>
                    <Input
                      id="organizer.name"
                      value={formData.organizer.name}
                      onChange={(e) => handleInputChange("organizer.name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizer.title">Título/Cargo</Label>
                    <Input
                      id="organizer.title"
                      value={formData.organizer.title}
                      onChange={(e) => handleInputChange("organizer.title", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="organizer.bio">Biografía</Label>
                  <Textarea
                    id="organizer.bio"
                    value={formData.organizer.bio}
                    onChange={(e) => handleInputChange("organizer.bio", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-6">
                <Button type="submit" disabled={loading || uploadingImage} className="bg-pink-500 hover:bg-pink-600">
                  {loading ? "Creando..." : uploadingImage ? "Subiendo imagen..." : "Crear Evento"}
                </Button>
                <Link href="/admin/eventos">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
