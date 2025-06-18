import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Calendar, MessageCircle, ShoppingBag, Stethoscope } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Bienvenida a tu
                <span className="text-pink-600"> comunidad </span>
                de madres
              </h1>
              <p className="text-xl text-gray-600">
                Un espacio cálido y seguro donde las madres se conectan, comparten experiencias y encuentran el apoyo
                que necesitan en cada etapa de la maternidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8">
                    Únete a Nosotras
                  </Button>
                </Link>
                <Link href="/foro">
                  <Button size="lg" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                    Explora la Comunidad
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-mother-child.png"
                alt="Madre feliz con su hijo"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre recursos, conecta con otras madres y encuentra el apoyo que buscas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Foro de Comunidad</h3>
                <p className="text-gray-600">
                  Comparte experiencias, haz preguntas y conecta con madres que entienden tu camino.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Directorio Médico</h3>
                <p className="text-gray-600">
                  Encuentra pediatras, ginecólogos y especialistas recomendados por otras madres.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
                <p className="text-gray-600">
                  Descubre productos recomendados, reseñas honestas y ofertas especiales para madres.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lugares de Encuentro</h3>
                <p className="text-gray-600">
                  Cafeterías, parques y espacios kid-friendly para conocer otras familias.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Eventos y Talleres</h3>
                <p className="text-gray-600">
                  Participa en charlas, talleres y eventos diseñados especialmente para madres.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Apoyo Emocional</h3>
                <p className="text-gray-600">
                  Un espacio seguro para compartir alegrías, preocupaciones y recibir apoyo genuino.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-pink-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestras madres</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 italic">
                  "MomSite me ayudó a encontrar mi tribu. Las conexiones que he hecho aquí son invaluables."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-600 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">María González</p>
                    <p className="text-sm text-gray-500">Madre de 2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 italic">
                  "Los recursos de profesionales y las recomendaciones de otras madres han sido increíblemente útiles."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ana Rodríguez</p>
                    <p className="text-sm text-gray-500">Madre primeriza</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 italic">
                  "Finalmente encontré un lugar donde puedo ser yo misma y recibir apoyo sin juicios."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">L</span>
                  </div>
                  <div>
                    <p className="font-semibold">Laura Martínez</p>
                    <p className="text-sm text-gray-500">Madre de 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Lista para unirte a nuestra comunidad?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Miles de madres ya forman parte de MomSite. Únete hoy y descubre el apoyo que has estado buscando.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 px-8">
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
