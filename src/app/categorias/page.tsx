"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerTodasCategorias } from '../services/categoriaService';

interface Categoria {
    idCategoria: number;
    nombre: string;
}

const Categorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await obtenerTodasCategorias();
                setCategorias(data);
            } catch (error) {
                setError("Error cargando categorías");
                console.error(error);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <div>
            <h1>Listado de Categorías</h1>
            {error && <p>{error}</p>}
            <ul>
                {categorias.map((categoria: Categoria, index: number) => (
                    <li key={`${categoria.idCategoria}-${index}`}>
                        {categoria.nombre}
                        <button
                            onClick={() => {
                                router.push(`/categorias/eliminar-categoria?id=${categoria.idCategoria}`);
                            }}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={() => router.push('/categorias/crear-categoria')}>
                Crear Nueva Categoría
            </button>
        </div>
    );
};

export default Categorias;
