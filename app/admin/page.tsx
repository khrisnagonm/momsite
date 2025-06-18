"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Users, MapPin, Star } from "lucide-react"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Event {
  id: string
  title: string
  category: string
  type: string
  date: string
  time: string
  location: string
  price: number
  maxAttendees: number
  currentAttendees: number
  status: string
  rating: number
  reviewCount: number
  createdAt: any
  createdBy: string
}

export default function AdminEventosPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  useEffect(() => {
    if (user && isAdmin && db) {
      loadEvents()
    }
  }, [user, isAdmin])

  const loadEvents = async () => {
    if (!db) return

    try {
      // Consulta simplificada sin orderBy para evitar índice compuesto
      const eventsQuery = query(collection(db, "events"), where("status", "!=", "deleted"))

      const snapshot = await getDocs(eventsQuery)
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[]

      // Ordenar en el cliente por fecha de creación (más recientes primero)
      eventsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0)
        const dateB = b.createdAt?.toDate?.() || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })

      setEvents(eventsData)
      setLoadingEvents(false)
    } catch (error) {
      console.error("Error loading events:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos.",
        variant: "destructive",
      })
      setLoadingEvents(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!db || !user) {
      toast({
        title: "Error",
        description: "No se pudo conectar a la base de datos.",
        variant: "destructive",
      })
      return
    }

    try {
      setDeletingEventId(eventId)
      console.log("Eliminando evento:", eventId) // Debug

      // Eliminación lógica: cambiar estado a "deleted"
      const eventRef = doc(db, "events", eventId)
      await updateDoc(eventRef, {
        status: "deleted",
        deletedAt: new Date().toISOString(),
        deletedBy: user.uid,
      })

      console.log("Evento eliminado exitosamente") // Debug

      // Actualizar la lista local removiendo el evento eliminado
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))

      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: `No se pudo eliminar el evento: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setDeletingEventId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    router.push("/")
    return null
  }

  if (loadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Activo</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-700">Borrador</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const totalAttendees = events.reduce((sum, event) => sum + (event.currentAttendees || 0), 0)
  const averageRating =
    events.length > 0 ? events.reduce((sum, event) => sum + (event.rating || 0), 0) / events.length : 0
  const activeEvents = events.filter((event) => event.status === "active").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
              <p className="text-gray-600 mt-1">Administra todos los eventos y talleres</p>
            </div>
            <Link href="/admin/eventos/nuevo">
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Asistentes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAttendees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eventos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar eventos por título, categoría o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Eventos ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No hay eventos</p>
                <p className="text-gray-400 mb-4">
                  {searchTerm
                    ? "No se encontraron eventos con ese término de búsqueda"
                    : "Comienza creando tu primer evento"}
                </p>
                <Link href="/admin/eventos/nuevo">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Evento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Asistentes</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(event.date)}</p>
                            <p className="text-sm text-gray-500">{event.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {event.currentAttendees || 0}
                            {event.maxAttendees ? `/${event.maxAttendees}` : " (sin límite)"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.price === 0 ? (
                            <Badge className="bg-green-100 text-green-700">Gratis</Badge>
                          ) : (
                            `$${event.price} CLP`
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {event.rating || 0} ({event.reviewCount || 0})
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" title="Ver evento">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Link href={`/admin/eventos/editar/${event.id}`}>
                              <Button variant="outline" size="sm" title="Editar evento">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog
                              open={openDialogId === event.id}
                              onOpenChange={(open) => !open && setOpenDialogId(null)}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Eliminar evento"
                                  disabled={deletingEventId === event.id}
                                  onClick={() => setOpenDialogId(event.id)}
                                >
                                  {deletingEventId === event.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará el evento "{event.title}" de la vista pública y del panel de
                                    administración. El evento no se eliminará permanentemente de la base de datos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={deletingEventId === event.id}>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      await handleDeleteEvent(event.id)
                                      setOpenDialogId(null)
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingEventId === event.id}
                                  >
                                    {deletingEventId === event.id ? "Eliminando..." : "Eliminar"}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
