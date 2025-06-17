import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-pink-50 border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold text-pink-600">MomSite</span>
            </div>
            <p className="text-sm text-gray-600">
              Una comunidad cálida y acogedora para madres que buscan apoyo, recursos y conexión.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link href="/sobre-nosotras" className="block text-sm text-gray-600 hover:text-pink-600">
                Sobre Nosotras
              </Link>
              <Link href="/foro" className="block text-sm text-gray-600 hover:text-pink-600">
                Foro
              </Link>
              <Link href="/eventos" className="block text-sm text-gray-600 hover:text-pink-600">
                Eventos
              </Link>
              <Link href="/contacto" className="block text-sm text-gray-600 hover:text-pink-600">
                Contacto
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Recursos</h3>
            <div className="space-y-2">
              <Link href="/marketplace" className="block text-sm text-gray-600 hover:text-pink-600">
                Marketplace
              </Link>
              <Link href="/profesinales" className="block text-sm text-gray-600 hover:text-pink-600">
                Profesionales
              </Link>
              <Link href="/lugares" className="block text-sm text-gray-600 hover:text-pink-600">
                Lugares de Encuentro
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Newsletter</h3>
            <p className="text-sm text-gray-600">Recibe las últimas noticias y recursos para madres.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Tu email" className="flex-1" />
              <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 MomSite. Todos los derechos reservados. Hecho con ❤️ para madres.
          </p>
        </div>
      </div>
    </footer>
  )
}
