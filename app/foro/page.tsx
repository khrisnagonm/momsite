"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  MessageCircle,
  Heart,
  Share2,
  Clock,
  User,
  Plus,
  TrendingUp,
  Pin,
  Eye,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Flag,
  Bookmark,
  Users,
  Baby,
  Stethoscope,
  Coffee,
  BookOpen,
  Smile,
} from "lucide-react"

const forumPosts = []


const categories = [
  { name: "Todas", icon: <MessageCircle className="h-4 w-4" />, count: 156 },
  { name: "Crianza", icon: <Baby className="h-4 w-4" />, count: 45 },
  { name: "Salud", icon: <Stethoscope className="h-4 w-4" />, count: 32 },
  { name: "Alimentación", icon: <Coffee className="h-4 w-4" />, count: 28 },
  { name: "Lactancia", icon: <Heart className="h-4 w-4" />, count: 23 },
  { name: "Ocio", icon: <Smile className="h-4 w-4" />, count: 19 },
  { name: "Educación", icon: <BookOpen className="h-4 w-4" />, count: 15 },
  { name: "Anuncios", icon: <Pin className="h-4 w-4" />, count: 8 },
]

const sortOptions = [
  { value: "recent", label: "Más recientes" },
  { value: "popular", label: "Más populares" },
  { value: "replies", label: "Más comentarios" },
  { value: "likes", label: "Más likes" },
]

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [sortBy, setSortBy] = useState("recent")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<(typeof forumPosts)[0] | null>(null)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })
  const { user } = useAuth()

  const filteredPosts = forumPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "Todas" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes
        case "replies":
          return b.replies - a.replies
        case "likes":
          return b.likes - a.likes
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat?.icon || <MessageCircle className="h-4 w-4" />
  }

  const handleNewPost = () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }
    setShowNewPostModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Foro de la Comunidad</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un espacio seguro donde las madres comparten experiencias, se apoyan mutuamente y crean conexiones
              genuinas
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* New Post Button */}
            <Button onClick={handleNewPost} className="w-full bg-purple-500 hover:bg-purple-600" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Post
            </Button>

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
                        ? "bg-purple-100 text-purple-700"
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

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Miembros activos</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Posts totales</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Posts hoy</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conectadas ahora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[].map((user, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">{user[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{user}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar en el foro..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex space-x-4">
                      {/* Author Avatar */}
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>

                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-wrap">
                            {post.isPinned && <Pin className="h-4 w-4 text-purple-500" />}
                            {post.isHot && <TrendingUp className="h-4 w-4 text-red-500" />}
                            <Badge variant="outline" className="text-xs">
                              {getCategoryIcon(post.category)}
                              <span className="ml-1">{post.category}</span>
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Title */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <h3
                              className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer line-clamp-2 mb-2"
                              onClick={() => setSelectedPost(post)}
                            >
                              {post.title}
                            </h3>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            {selectedPost && <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />}
                          </DialogContent>
                        </Dialog>

                        {/* Content Preview */}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{post.author.name}</span>
                              <Badge variant="outline" className="text-xs ml-1">
                                {post.author.badge}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>

                        {/* Last Reply */}
                        {post.lastReply && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Última respuesta de <span className="font-medium">{post.lastReply.author}</span>{" "}
                              {post.lastReply.time}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aún no hay posts en el foro.</p>
                  <Button onClick={handleNewPost} className="mt-4 bg-purple-500 hover:bg-purple-600">
                    Crear el primer post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <Dialog open={showNewPostModal} onOpenChange={setShowNewPostModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Post</DialogTitle>
          </DialogHeader>
          <NewPostForm onClose={() => setShowNewPostModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// New Post Form Component
function NewPostForm({ onClose }: { onClose: () => void }) {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the post to your backend
    console.log("New post:", newPost)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={newPost.title}
          onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="¿Cuál es tu pregunta o tema?"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoría *</Label>
        <Select
          value={newPost.category}
          onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.slice(1).map((category) => (
              <SelectItem key={category.name} value={category.name}>
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="content">Contenido *</Label>
        <Textarea
          id="content"
          value={newPost.content}
          onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Comparte tu experiencia, pregunta o consejo..."
          className="min-h-[120px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (opcional)</Label>
        <Input
          id="tags"
          value={newPost.tags}
          onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="Ej: lactancia, sueño, alimentación (separados por comas)"
        />
        <p className="text-xs text-gray-500 mt-1">Ayuda a otras madres a encontrar tu post más fácilmente</p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
          Publicar Post
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

// Post Detail Component
function PostDetail({ post, onClose }: { post: (typeof forumPosts)[0]; onClose: () => void }) {
  const { user } = useAuth()
  const [newReply, setNewReply] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)

  const sampleReplies = [
    {
      id: 1,
      author: {
        name: "Carmen López",
        avatar: "/placeholder.svg?height=40&width=40",
        badge: "Mamá de 3",
      },
      content:
        "¡Ay, María! Te entiendo perfectamente. Yo pasé por lo mismo con mi segundo hijo. Lo que me funcionó fue mantener la calma (aunque por dentro estuviera hirviendo) y darle opciones limitadas. Por ejemplo: '¿Quieres caminar o que te lleve en brazos?' Así siente que tiene control pero dentro de límites.",
      createdAt: "Hace 1 hora",
      likes: 8,
    },
    {
      id: 2,
      author: {
        name: "Ana Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40",
        badge: "Mamá de 1",
      },
      content:
        "A mí me ayudó mucho leer sobre el desarrollo emocional a esa edad. Las rabietas son normales, es su forma de expresar frustración porque aún no tienen las palabras. Te recomiendo el libro 'El cerebro del niño' de Daniel Siegel.",
      createdAt: "Hace 45 min",
      likes: 12,
    },
    {
      id: 3,
      author: {
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40",
        badge: "Mamá de 2",
      },
      content:
        "Una técnica que me enseñó mi pediatra es la del 'tiempo dentro' en lugar del 'tiempo fuera'. Cuando mi hija tiene una rabieta, me siento con ella y le digo que entiendo que esté enfadada, pero que cuando se calme podemos hablar. Funciona mejor que castigarla.",
      createdAt: "Hace 30 min",
      likes: 15,
    },
  ]

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-left">{post.title}</DialogTitle>
      </DialogHeader>

      {/* Post Header */}
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold">{post.author.name}</h4>
            <Badge variant="outline" className="text-xs">
              {post.author.badge}
            </Badge>
            <span className="text-xs text-gray-500">• {post.author.joinDate}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.createdAt}</span>
            <Badge variant="outline" className="text-xs">
              {getCategoryIcon(post.category)}
              <span className="ml-1">{post.category}</span>
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between py-4 border-y">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
            <Heart className="h-4 w-4 mr-1" />
            {post.likes} Me gusta
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => setShowReplyForm(!showReplyForm)}>
            <Reply className="h-4 w-4 mr-1" />
            Responder
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{post.views} visualizaciones</span>
          <span>{post.replies} respuestas</span>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && user && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Escribe tu respuesta..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowReplyForm(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Replies */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Respuestas ({sampleReplies.length})</h4>
        {sampleReplies.map((reply) => (
          <Card key={reply.id}>
            <CardContent className="pt-4">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-medium text-sm">{reply.author.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {reply.author.badge}
                    </Badge>
                    <span className="text-xs text-gray-500">{reply.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-red-500">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {reply.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                      <Reply className="h-3 w-3 mr-1" />
                      Responder
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getCategoryIcon(category: string) {
  const categories = [
    { name: "Crianza", icon: <Baby className="h-4 w-4" /> },
    { name: "Salud", icon: <Stethoscope className="h-4 w-4" /> },
    { name: "Alimentación", icon: <Coffee className="h-4 w-4" /> },
    { name: "Lactancia", icon: <Heart className="h-4 w-4" /> },
    { name: "Ocio", icon: <Smile className="h-4 w-4" /> },
    { name: "Educación", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Anuncios", icon: <Pin className="h-4 w-4" /> },
  ]

  const cat = categories.find((c) => c.name === category)
  return cat?.icon || <MessageCircle className="h-4 w-4" />
}
