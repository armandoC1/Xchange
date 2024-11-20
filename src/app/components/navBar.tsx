'use client'

import Link from "next/link"
import { useState } from "react"

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent"
            >
              XChange
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {[
              ['Inicio', '/'],
              ['Publicaciones', '/ofertas'],
              ['Categorías', '/categorias'],
              ['Mis publicaciones', '/ofertas/mis'],
              // ['Reseñas', '/resenas'],
              ['Mensajes', '/chat'],
              ['Solicitudes', '/solicitudes'],
            ].map(([title, url]) => (
              <Link
                key={title}
                href={url}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-600/10 hover:text-gray-900"
              >
                {title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {[
            ['Inicio', '/'],
            ['Publicaciones', '/ofertas'],
            ['Categorías', '/categorias'],
            ['Mis publicaciones', '/ofertas/mis'],
            // ['Reseñas', '/resenas'],
            ['Mensajes', '/chat'],
            ['Solicitudes', '/solicitudes'],
          ].map(([title, url]) => (
            <Link
              key={title}
              href={url}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-600/10 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}