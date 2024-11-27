'use client';

import { useEffect, useState } from 'react';
import { obtenerTodasCategorias, eliminarCategoria, crearCategoria, actualizarCategoria } from '../services/categoriaService';
import Swal from 'sweetalert2';
import { Boxes, Laptop, Smartphone, Home, Car, Book, Music, ShoppingBag, Utensils, Shirt, Plus, Pencil, Trash2 } from 'lucide-react';

interface Categoria {
  id: number;
  nombre: string;
}

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  'Electrónica': Laptop,
  'Móviles': Smartphone,
  'Hogar': Home,
  'Vehículos': Car,
  'Libros': Book,
  'Música': Music,
  'Moda': Shirt,
  'Alimentación': Utensils,
  'default': ShoppingBag
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [page, setPage] = useState(1);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await obtenerTodasCategorias(page, limit);
      setCategorias(response.content);
      setTotalCategorias(response.totalElements);
    } catch (error) {
      console.log('Error al cargar las categorías: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las categorías',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [page]);

  const handleCrearCategoria = async () => {
    const { value: nombre } = await Swal.fire({
      title: 'Nueva Categoría',
      input: 'text',
      inputLabel: 'Nombre de la categoría',
      inputPlaceholder: 'Ingrese el nombre de la categoría',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      background: '#F3F4F6',
      customClass: {
        title: '!text-2xl !font-bold !text-gray-800',
        input: '!rounded-lg !border-gray-300 !shadow-sm focus:!border-blue-500 focus:!ring-blue-500',
        confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
        cancelButton: '!bg-red-600 !text-white hover:!bg-red-700 !rounded-lg !px-5 !py-2.5',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un nombre para la categoría';
        }
        return null;
      }
    });

    if (nombre) {
      try {
        await crearCategoria({ nombre });
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Categoría creada exitosamente',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
        fetchCategorias();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la categoría',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
      }
    }
  };

  const handleEditarCategoria = async (categoria: Categoria) => {
    const { value: nombre } = await Swal.fire({
      title: 'Editar Categoría',
      input: 'text',
      inputLabel: 'Nombre de la categoría',
      inputValue: categoria.nombre,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      background: '#F3F4F6',
      customClass: {
        title: '!text-2xl !font-bold !text-gray-800',
        input: '!rounded-lg !border-gray-300 !shadow-sm focus:!border-blue-500 focus:!ring-blue-500',
        confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
        cancelButton: '!bg-red-600 !text-white hover:!bg-red-700 !rounded-lg !px-5 !py-2.5',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un nombre para la categoría';
        }
        return null;
      }
    });

    if (nombre) {
      try {
        await actualizarCategoria({ id: categoria.id, nombre });
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Categoría actualizada exitosamente',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
        fetchCategorias();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la categoría',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
      }
    }
  };

  const handleEliminarCategoria = async (categoria: Categoria) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la categoría "${categoria.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#F3F4F6',
      customClass: {
        title: '!text-2xl !font-bold !text-gray-800',
        confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
        cancelButton: '!bg-red-600 !text-white hover:!bg-red-700 !rounded-lg !px-5 !py-2.5',
      }
    });

    if (result.isConfirmed) {
      try {
        await eliminarCategoria(categoria.id);
        Swal.fire({
          title: '¡Eliminada!',
          text: 'La categoría ha sido eliminada exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
        fetchCategorias();
      } catch (error) {
        console.log('Error al eliminar la categoría:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar la categoría.',
          icon: 'error',
          confirmButtonColor: '#3B82F6',
          background: '#F3F4F6',
          customClass: {
            title: '!text-2xl !font-bold !text-gray-800',
            confirmButton: '!bg-blue-600 !text-white hover:!bg-blue-700 !rounded-lg !px-5 !py-2.5',
          }
        });
      }
    }
  };

  const totalPages = Math.ceil(totalCategorias / limit);
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };
  const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

  const getIconForCategory = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName] || categoryIcons.default;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 sm:mb-0">
            Categorías
          </h1>
          <button 
            onClick={handleCrearCategoria}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Categoría
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : categorias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map(categoria => (
              <div
                key={categoria.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full text-white">
                      {getIconForCategory(categoria.nombre)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {categoria.nombre}
                    </h2>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditarCategoria(categoria)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarCategoria(categoria)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Boxes className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva categoría.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700 bg-white px-3 py-2 rounded-m
d shadow">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

