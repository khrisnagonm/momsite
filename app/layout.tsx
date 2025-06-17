import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MomSite - Comunidad de Madres",
  description: "Una comunidad cálida y acogedora para madres que buscan apoyo, recursos y conexión.",
  keywords: "madres, maternidad, comunidad, apoyo, recursos, familia",
  authors: [{ name: "MomSite Team" }],
  openGraph: {
    title: "MomSite - Comunidad de Madres",
    description: "Una comunidad cálida y acogedora para madres que buscan apoyo, recursos y conexión.",
    type: "website",
    locale: "es_ES",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
