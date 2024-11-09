'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { obtenerTodasCategorias, eliminarCategoria } from '../services/categoriaService'
import Swal from 'sweetalert2'

interface Categoria {
    id: number
    nombre: string
}

export default function CategoriasPage() {
<<<<<<< HEAD
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [page, setPage] = useState(1)   
    const [totalCategorias, setTotalCategorias] = useState(0) 
    const limit = 10
=======
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [page, setPage] = useState(1);
    const [totalCategorias, setTotalCategorias] = useState(0);
    const limit = 10;
>>>>>>> origin/master

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await obtenerTodasCategorias(page, limit)
                setCategorias(response.content)
                setTotalCategorias(response.totalElements)
            } catch (error) {
                console.log('Error al cargar las categorías: ', error)
            }
        }

        fetchCategorias()
    }, [page])

    const totalPage = Math.ceil(totalCategorias / limit)

    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(prevPage => prevPage + 1)
        }
    }

    const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1))

    const handleEliminarCategoria = async (categoria: Categoria) => {
        const confirmacion = window.confirm(`¿Estás seguro de eliminar esta categoría ${categoria.nombre}?`)
        if (confirmacion) {
            try {
<<<<<<< HEAD
                await eliminarCategoria(categoria.id)
                console.log("Id que quiero eliminar: ",categoria.id) 
=======
                await eliminarCategoria(categoria.id);
                console.log("Id que quiero eliminar: ", categoria.id)
>>>>>>> origin/master
                Swal.fire({
                    title: 'Categoría eliminada',
                    text: 'Categoría eliminada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'my-custom-alert'
                    }
                })
                setCategorias(prevCategorias => prevCategorias.filter(c => c.id !== categoria.id))
            } catch (error) {
                console.log('Error al eliminar la categoría:', error)
                alert('Hubo un problema al eliminar la categoría.')
            }
        }
    }

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-lavender-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-10 text-center">Categorías</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                    {categorias.length > 0 ? (
                        categorias.map(categoria => (
                            <div key={categoria.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-indigo-700 mb-4">{categoria.nombre}</h2>
                                    <div className="flex flex-col space-y-3">
                                        <button 
                                            onClick={() => handleEliminarCategoria(categoria)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                                        >
                                            Eliminar categoría
                                        </button>
                                        <Link href={`/categorias/editar-categoria/${categoria.id}`}>
                                            <span className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 block text-center">
                                                Editar categoría
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No hay categorías disponibles</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                    <Link href="/categorias/crear-categoria">
                        <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center block">
                            Crear una nueva categoría
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handlePreviousPage} 
                            disabled={page === 1}
                            className="bg-lavender-300 hover:bg-lavender-400 text-indigo-800 font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="text-indigo-800 font-medium">
                            Página {page} de {totalPage}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            disabled={page >= totalPage}
                            className="bg-lavender-300 hover:bg-lavender-400 text-indigo-800 font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
=======
        <div>
            <h1>Categorías</h1>
            {categorias.length > 0 ? (
                <div>
                    {categorias.map(categoria => (
                        <div key={categoria.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <h5 className='text-slate-950'>Nombre de la categoría: {categoria.nombre}</h5>
                            <button className='text-red-600' onClick={() => handleEliminarCategoria(categoria)}>Eliminar categoría</button>
                            <Link href={`/categorias/editar-categoria/${categoria.id}`}>
                                <button className='text-lime-500'>Editar categoria</button>
                            </Link>
                        </div>

                    ))}
>>>>>>> origin/master
                </div>
            </div>
        </div>
<<<<<<< HEAD
    )
=======
    );
>>>>>>> origin/master
}