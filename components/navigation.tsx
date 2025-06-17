"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart, User, LogOut, Settings, ChevronDown, Shield } from "lucide-react"

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-nosotras", label: "Sobre Nosotras" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/lugares", label: "Lugares de Encuentro" },
  { href: "/foro", label: "Foro" },
  { href: "/eventos", label: "Eventos" },
  { href: "/contacto", label: "Contacto" },
]

export function Navigation() {
  const { user, isAdmin, logout, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold text-pink-600">MomSite</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-600">MomSite</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Admin Link - Solo visible para administradores */}
          {user && isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => {
                  console.log("Dropdown trigger clicked")
                  setIsDropdownOpen(!isDropdownOpen)
                }}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mi Cuenta</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </Button>

              {/* Custom Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="flex items-center justify-start gap-2 p-3 border-b border-gray-100">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.displayName || "Usuario"}</p>
                      <p className="w-[200px] truncate text-xs text-gray-500">{user.email}</p>
                      {isAdmin && (
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full w-fit">
                          Administrador
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Panel de Admin
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      console.log("Logout clicked")
                      logout()
                      setIsDropdownOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                  Únete
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-gray-600 hover:text-pink-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <div className="px-2 py-1">
                      <p className="font-medium">{user.displayName || "Usuario"}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full w-fit mt-1 inline-block">
                          Administrador
                        </span>
                      )}
                    </div>
                    <Link href="/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Panel de Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-pink-500 hover:bg-pink-600">Únete</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
