"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Heart, Share2, MessageCircle, Star, Eye, ShoppingBag, Clock, Shield } from "lucide-react"
import type { Product, SortOption } from "@/types"

// Empty array with explicit type
const products: Product[] = []

const categories = [
  "Todas las categorías",
  "Ropa de bebé",
  "Juguetes",
  "Cochecitos",
  "Sillas de coche",
  "Alimentación",
  "Cuidado",
  "Libros",
  "Decoración",
]

const conditions = ["Todas las condiciones", "Nuevo", "Como nuevo", "Buen estado", "Estado regular"]

const sortOptions: SortOption[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price-low", label: "Precio: menor a mayor" },
  { value: "price-high", label: "Precio: mayor a menor" },
  { value: "popular", label: "Más populares" },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías")
  const [selectedCondition, setSelectedCondition] = useState("Todas las condiciones")
  const [sortBy, setSortBy] = useState("newest")

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "Todas las categorías" || product.category === selectedCategory

      const matchesCondition = selectedCondition === "Todas las condiciones" || product.condition === selectedCondition

      return matchesSearch && matchesCategory && matchesCondition
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "popular":
          return b.views - a.views
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="container px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Marketplace</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compra y vende productos para bebés y niños de forma segura entre madres de confianza
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`${
                      product.condition === "new"
                        ? "bg-green-500"
                        : product.condition === "like-new"
                          ? "bg-blue-500"
                          : product.condition === "good"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    } text-white`}
                  >
                    {product.condition === "new"
                      ? "Nuevo"
                      : product.condition === "like-new"
                        ? "Como nuevo"
                        : product.condition === "good"
                          ? "Buen estado"
                          : "Regular"}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {product.originalPrice && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="destructive">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">€{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={product.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="text-sm font-medium truncate">{product.seller.name}</p>
                      {product.seller.verified && <Shield className="h-3 w-3 text-blue-500" />}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {product.seller.rating} ({product.seller.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  {product.location}
                  <Eye className="h-3 w-3 ml-3 mr-1" />
                  {product.views}
                  <Clock className="h-3 w-3 ml-3 mr-1" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aún no hay productos disponibles.</p>
              <p className="text-gray-400 text-sm mt-2">
                Pronto tendrás acceso a un marketplace seguro para comprar y vender productos entre madres.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
