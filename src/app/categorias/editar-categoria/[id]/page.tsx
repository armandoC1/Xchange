'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { obtenerCategoriaPorId, actualizarCategoria } from '@/app/services/categoriaService';
import { Pencil, ArrowLeft } from 'lucide-react';

interface Categoria {
    id: number;
    nombre: string;
}

export default function CategoriaDetallesPage() {
    const { id } = useParams();
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [nombre, setNombre] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            const fetchCategoria = async () => {
                setLoading(true);
                try {
                    const data = await obtenerCategoriaPorId(Number(id));
                    setCategoria(data);
                    setNombre(data.nombre);
                } catch (error) {
                    console.error('Error al cargar la categoría', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar la categoría',
                        confirmButtonColor: '#3B82F6'
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoria();
        }
    }, [id]);

    const handleGuardarCambios = async () => {
        if (categoria) {
            try {
                const resultado = await actualizarCategoria({ id: categoria.id, nombre });
                if (resultado) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Categoría actualizada exitosamente.',
                        icon: 'success',
                        confirmButtonColor: '#3B82F6'
                    }).then(() => {
                        router.push('/categorias');
                    });
                } else {
                    throw new Error('No se pudo actualizar la categoría');
                }
            } catch (error) {
                console.error('Error al actualizar la categoría:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la categoría.',
                    icon: 'error',
                    confirmButtonColor: '#3B82F6'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!categoria) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Categoría no encontrada</h1>
                <Link href="/categorias">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Volver a categorías
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Editar Categoría
                            </h1>
                            <Link href="/categorias">
                                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </button>
                            </Link>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la categoría
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ingrese el nombre de la categoría"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleGuardarCambios}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
                            >
                                <Pencil className="h-5 w-5 mr-2" />
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}