'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { obtenerTodasCategorias, eliminarCategoria } from '../services/categoriaService';
import Swal from 'sweetalert2';

interface Categoria {
    id: number;
    nombre: string;
}

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [page, setPage] = useState(1);   
    const [totalCategorias, setTotalCategorias] = useState(0); 
    const limit = 10;

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await obtenerTodasCategorias(page, limit);
                setCategorias(response.content);
                setTotalCategorias(response.totalElements);
            } catch (error) {
                console.log('Error al cargar las categorías: ', error);
            }
        };

        fetchCategorias();
    }, [page]);

    const totalPage = Math.ceil(totalCategorias / limit);

    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

    const handleEliminarCategoria = async (categoria: Categoria) => {
        const confirmacion = window.confirm(`¿Estás seguro de eliminar esta categoría ${categoria.nombre}?`);
        if (confirmacion) {
            try {
                await eliminarCategoria(categoria.id);
                console.log("Id que quiero eliminar: ",categoria.id) 
                Swal.fire({
                    title: 'Categoría eliminada',
                    text: 'Categoría eliminada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'my-custom-alert'
                    }
                });
                setCategorias(prevCategorias => prevCategorias.filter(c => c.id !== categoria.id));
            } catch (error) {
                console.log('Error al eliminar la categoría:', error);
                alert('Hubo un problema al eliminar la categoría.');
            }
        }
    };

    return (
        <div>
            <h1>Categorías</h1>
            {categorias.length > 0 ? (
                <div>
                    {categorias.map(categoria => (
                        <div key={categoria.id}  style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <h5 className='text-slate-950'>Nombre de la categoría: {categoria.nombre}</h5>
                            <button className='text-red-600' onClick={() => handleEliminarCategoria(categoria)}>Eliminar categoría</button>
                            <br />
                            <Link href={`/categorias/editar-categoria/${categoria.id}`}>
                                <button className='text-lime-500'>Editar categoria</button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p></p>
            )}
            <Link href={'/categorias/crear-categoria'}>
                <button><h5 className='text-lime-600 text-2xl'>Crear una nueva categoria</h5></button>
            </Link>
            <div style={{ marginTop: '20px' }}>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Anterior
                </button>
                <span style={{ margin: '0 10px' }}>Página {page} de {totalPage}</span>
                <button onClick={handleNextPage} disabled={page >= totalPage}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}
