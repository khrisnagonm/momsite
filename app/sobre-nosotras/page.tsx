import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sobre Nosotras</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              MomSite nació del corazón de madres que entendían la necesidad de tener un espacio seguro, cálido y
              comprensivo donde compartir la hermosa pero desafiante experiencia de la maternidad.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-600 mb-6">
                Creemos que ninguna madre debería sentirse sola en su camino. Nuestra misión es crear una comunidad
                donde cada madre pueda encontrar apoyo, recursos confiables y conexiones genuinas que enriquezcan su
                experiencia maternal.
              </p>
              <p className="text-lg text-gray-600">
                Desde consejos prácticos hasta apoyo emocional, desde recomendaciones médicas hasta espacios para el
                desahogo, MomSite es tu hogar digital donde siempre encontrarás comprensión y ayuda.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/nosotras.png"
                alt="Madres conectándose"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-pink-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y cada interacción en nuestra comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Empatía</h3>
                <p className="text-gray-600">
                  Entendemos que cada experiencia maternal es única y respetamos todas las perspectivas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Seguridad</h3>
                <p className="text-gray-600">
                  Creamos un espacio libre de juicios donde puedes ser auténtica y vulnerable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comunidad</h3>
                <p className="text-gray-600">
                  Fomentamos conexiones reales que trascienden lo digital y crean lazos duraderos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Crecimiento</h3>
                <p className="text-gray-600">
                  Celebramos cada logro y apoyamos en cada desafío del crecimiento personal y maternal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-pink-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">El Comienzo</h3>
                <p className="text-lg text-gray-600">
                  Todo comenzó en 2023 cuando un grupo de madres se dio cuenta de que, a pesar de estar más conectadas
                  que nunca a través de las redes sociales, muchas se sentían aisladas y sin el apoyo real que
                  necesitaban. Las conversaciones superficiales no llenaban el vacío de conexión genuina que buscaban.
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">La Visión</h3>
                <p className="text-lg text-gray-600">
                  Decidimos crear algo diferente: una plataforma que no solo conectara madres, sino que también
                  proporcionara recursos prácticos, información confiable y espacios para el crecimiento personal.
                  Queríamos que cada madre sintiera que tenía una tribu que la respaldaba.
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hoy</h3>
                <p className="text-lg text-gray-600">
                  MomSite ha crecido hasta convertirse en una comunidad vibrante de miles de madres que se apoyan
                  mutuamente cada día. Hemos visto nacer amistades, resolver dudas importantes, celebrar logros y
                  brindar consuelo en momentos difíciles. Esta es solo el comienzo de nuestro viaje juntas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Madre, profesional y persona apasionada por crear un mundo mejor para las familias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">S</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Khrisna González</h3>
                <p className="text-pink-600 font-medium mb-3">Fundadora & CEO</p>
                <p className="text-gray-600 text-sm">
                  Madre de uno, informática y apasionada por crear comunidades que nutran el alma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
