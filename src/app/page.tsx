'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, RefreshCcw, Users, Star } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    if (!token) {
      alert('Debes iniciar sesion para acceder')
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                XChange
              </Link>
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Inicio
              </Link>
              <Link
                href="/ofertas"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Ofertas
              </Link>
              <Link
                href="/categorias"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Categorías
              </Link>
              <Link
                href="/usuarios"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Usuarios
              </Link>
              <Link
                href="/resenas"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Reseñas
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            ¡Bienvenido a XChange!
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-white opacity-90">
            La plataforma donde puedes intercambiar bienes y servicios fácilmente.
          </p>
          <div className="mt-10">
            <Link
              href="/ofertas"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 transition-colors duration-150"
            >
              Explorar Ofertas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-6 right-6">
              <RefreshCcw className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Intercambia lo que quieras
            </h3>
            <p className="mt-4 text-gray-600">
              Explora miles de ofertas y encuentra lo que necesitas a cambio de lo que ya no usas.
            </p>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-6 right-6">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Conéctate con otros usuarios
            </h3>
            <p className="mt-4 text-gray-600">
              Accede a una comunidad activa y comienza a realizar trueques de manera fácil y rápida.
            </p>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-6 right-6">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Deja reseñas
            </h3>
            <p className="mt-4 text-gray-600">
              Comparte tu experiencia y ayuda a otros usuarios a tomar mejores decisiones.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white text-sm">
            © 2024 XChange. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
