'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listadoPaginado } from '../services/ofertasService';
import Swal from 'sweetalert2';

interface Oferta {
  idOferta: number;
  titulo: string;
  descripcion: string;
  condicion: string;
  ubicacion: string;
  imagenes: string[];
  idCategoria: number;
  idUsuario: number;
}

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [page, setPage] = useState(1);
  const [totalOfertas, setTotalOfertas] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 5; // Maximum 5 publications per page

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const response = await listadoPaginado(page, limit);
        setOfertas(response.content);
        setTotalOfertas(response.totalElements);
      } catch (error) {
        console.error('Error al cargar las ofertas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las ofertas',
          background: '#fff',
          confirmButtonColor: '#3B82F6'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [page]);

  const totalPages = Math.ceil(totalOfertas / limit);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Ofertas Disponibles
          </h1>
          <Link href="/ofertas/create">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105">
              Crear Nueva Oferta
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : ofertas.length > 0 ? (
          <div className="space-y-6">
            {ofertas.map(oferta => (
              <div
                key={oferta.idOferta}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 h-64 md:h-auto md:w-96 relative">
                    {oferta.imagenes && oferta.imagenes.length > 0 ? (
                      <img
                        src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
                        alt={`Imagen de ${oferta.titulo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:flex-1">
                    <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                      {oferta.condicion}
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {oferta.titulo}
                    </h2>
                    <p className="mt-4 text-gray-500 leading-relaxed line-clamp-3">
                      {oferta.descripcion}
                    </p>
                    <div className="mt-4 flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="ml-2">{oferta.ubicacion}</span>
                    </div>
                    <div className="mt-6">
                      <Link href={`/ofertas/ver/${oferta.idOferta}`}>
                        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105">
                          Ver detalles
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay ofertas disponibles en este momento.</p>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}