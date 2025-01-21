"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listadoPaginado, obtenerPorTitulo } from '../services/ofertasService'
import { mostrarCategorias } from '../services/categoriaService'
import { Search, MapPin } from 'lucide-react'
import Swal from 'sweetalert2'

interface Oferta {
  idOferta: number
  titulo: string
  descripcion: string
  estado: string
  condicion: string
  ubicacion: string
  imagenes: string[]
  idCategoria: number
  idUsuario: number
}

interface Categoria {
  id: number
  nombre: string
}

export default function IntercambiosPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [page, setPage] = useState(1)
  const [totalOfertas, setTotalOfertas] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const limit = 5
  const [userId, setUserId] = useState<number>(0)

  useEffect(() => {
    const storedId = sessionStorage.getItem('idUsuario')
    setUserId(parseInt(storedId || '0'))
  }, [])

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await mostrarCategorias()
        setCategorias(response)
      } catch (error) {
        console.error('Error al cargar las categorías:', error)
      }
    }
    fetchCategorias()
  }, [])

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true)
      try {
        let response
        if (searchTerm) {
          response = await obtenerPorTitulo(searchTerm)
          if (response && Array.isArray(response)) {
            const filteredOfertas = response.filter(
              (oferta: Oferta) =>
                oferta.idUsuario !== userId &&
                (!selectedCategory || oferta.idCategoria === selectedCategory) &&
                oferta.estado === 'activa'
            )
            setOfertas(filteredOfertas)
            setTotalOfertas(filteredOfertas.length)
          } else {
            setOfertas([])
            setTotalOfertas(0)
            Swal.fire({
              icon: 'warning',
              title: 'Sin resultados',
              text: 'No hay intercambios disponibles que coincidan con tu búsqueda.',
              background: '#fff',
              confirmButtonColor: '#3B82F6',
            })
          }
        } else {
          response = await listadoPaginado(page, limit)
          if (response && response.content) {
            const filteredOfertas = response.content.filter(
              (oferta: Oferta) =>
                oferta.idUsuario !== userId &&
                (!selectedCategory || oferta.idCategoria === selectedCategory) &&
                oferta.estado === 'activa'
            )
            setOfertas(filteredOfertas)
            setTotalOfertas(response.totalElements)
          } else {
            setOfertas([])
            setTotalOfertas(0)
            Swal.fire({
              icon: 'warning',
              title: 'Sin resultados',
              text: 'No hay intercambios disponibles.',
              background: '#fff',
              confirmButtonColor: '#3B82F6',
            })
          }
        }
      } catch (error) {
        console.error('Error al cargar los intercambios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOfertas()
  }, [page, userId, searchTerm, selectedCategory])

  const totalPages = Math.ceil(totalOfertas / limit)

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Trueques disponibles
          </h1>
          <Link href="/ofertas/create">
            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 text-sm font-medium text-gray-900 hover:text-white">
              <span className="relative rounded-full bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-white">
                Nueva Publicación
              </span>
            </button>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
            className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : ofertas.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {ofertas.map((oferta) => (
              <div
                key={oferta.idOferta}
                className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="relative h-64 w-full lg:h-auto lg:w-96">
                    {oferta.imagenes && oferta.imagenes.length > 0 ? (
                      <img
                        src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
                        alt={oferta.titulo}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-blue-600 backdrop-blur-sm">
                      {oferta.condicion}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="mb-2 text-xl font-bold text-gray-900">{oferta.titulo}</h2>
                      <p className="mb-4 text-gray-600 line-clamp-3">{oferta.descripcion}</p>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="text-sm">{oferta.ubicacion}</span>
                      </div>
                    </div>
                    <Link href={`/ofertas/ver/${oferta.idOferta}`}>
                      <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-500">No hay intercambios disponibles en este momento.</p>
          </div>
        )}

        {totalPages > 1 && !searchTerm && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
