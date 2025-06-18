"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Users, Plus, Search, Edit, Trash2, Eye, Star, MapPin, Mail, Award, Clock, ArrowLeft } from "lucide-react"
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"
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

export default function ProfessionalsAdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const [loadingProfessionals, setLoadingProfessionals] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterVerified, setFilterVerified] = useState("all")

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (user && isAdmin && db) {
      loadProfessionals()
    }
  }, [user, isAdmin])

  useEffect(() => {
    filterProfessionals()
  }, [professionals, searchTerm, filterSpecialty, filterStatus, filterVerified])

  const loadProfessionals = () => {
    try {
      const professionalsQuery = query(collection(db, "professionals"), orderBy("createdAt", "desc"))

      const unsubscribe = onSnapshot(professionalsQuery, (snapshot) => {
        const professionalsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Professional[]

        setProfessionals(professionalsData)
        setLoadingProfessionals(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error loading professionals:", error)
      toast.error("Error al cargar profesionales")
      setLoadingProfessionals(false)
    }
  }

  const filterProfessionals = () => {
    let filtered = professionals

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (professional) =>
          professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professional.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
          professional.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por especialidad
    if (filterSpecialty !== "all") {
      filtered = filtered.filter((professional) => professional.specialties.includes(filterSpecialty))
    }

    // Filtro por estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((professional) =>
        filterStatus === "active" ? professional.isActive : !professional.isActive,
      )
    }

    // Filtro por verificación
    if (filterVerified !== "all") {
      filtered = filtered.filter((professional) =>
        filterVerified === "verified" ? professional.isVerified : !professional.isVerified,
      )
    }

    setFilteredProfessionals(filtered)
  }

  const handleDeleteProfessional = async (professionalId: string, professionalName: string) => {
    try {
      await deleteDoc(doc(db, "professionals", professionalId))
      toast.success(`Profesional "${professionalName}" eliminado correctamente`)
    } catch (error) {
      console.error("Error deleting professional:", error)
      toast.error("Error al eliminar el profesional")
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha no disponible"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  const uniqueSpecialties = Array.from(new Set(professionals.flatMap((p) => p.specialties))).sort()

  if (loading || loadingProfessionals) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando profesionales...</p>
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
          <div>
            <Link href="/admin" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Profesionales</h1>
            <p className="text-gray-600 mt-1">Administra el directorio de profesionales verificados</p>
          </div>
          <Link href="/admin/profesionales/nuevo">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Profesional
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{professionals.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verificados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {professionals.filter((p) => p.isVerified).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-blue-600">{professionals.filter((p) => p.isActive).length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {professionals.length > 0
                      ? (professionals.reduce((sum, p) => sum + (p.rating || 0), 0) / professionals.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar profesionales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {uniqueSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por verificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                  <SelectItem value="unverified">No verificados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Professionals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Profesionales ({filteredProfessionals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProfessionals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profesional</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-pink-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">{professional.name}</p>
                                {professional.isVerified && <Award className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-gray-500">{professional.title}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{professional.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {professional.specialties.slice(0, 2).map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="secondary"
                                className={`text-xs ${getSpecialtyColor(specialty)}`}
                              >
                                {specialty}
                              </Badge>
                            ))}
                            {professional.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{professional.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{professional.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{professional.rating?.toFixed(1) || "0.0"}</span>
                            <span className="text-xs text-gray-500">({professional.reviewCount || 0})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge
                              variant={professional.isActive ? "default" : "secondary"}
                              className={
                                professional.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }
                            >
                              {professional.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            {professional.isVerified && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                Verificado
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{formatDate(professional.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/admin/profesionales/ver/${professional.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/profesionales/editar/${professional.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar profesional?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el profesional "
                                    {professional.name}" y todos sus datos asociados.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteProfessional(professional.id, professional.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay profesionales</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterSpecialty !== "all" || filterStatus !== "all" || filterVerified !== "all"
                    ? "No se encontraron profesionales con los filtros aplicados."
                    : "Comienza agregando tu primer profesional."}
                </p>
                <Link href="/admin/profesionales/nuevo">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Profesional
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
