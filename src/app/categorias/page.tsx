"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerTodasCategorias } from '../services/categoriaService';
import FormularioCategoria from '../components/FormularioCategoria';

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

    const handleCategoriaCreada = (categoria: Categoria) => {
        setCategorias([...categorias, categoria]);
    };

    return (
        <div>
            <h1>Listado de Categorías</h1>
            <FormularioCategoria onCategoriaCreada={handleCategoriaCreada} />
            {error && <p>{error}</p>}
            <ul>
                {categorias.map((categoria: Categoria, index: number) => (
                    
                    <li key={`${categoria.idCategoria}-${index}`}>
                        {categoria.nombre}

                        <button onClick={() => {
                            if (categoria.idCategoria) {
                                console.log(`Redirigiendo a eliminar categoría con ID: ${categoria.idCategoria}`);
                                router.push(`/categorias/eliminar-categoria?id=${categoria.idCategoria}`);
                            } else {
                                console.error("ID de categoría está undefined");
                                alert("Error: ID de categoría no encontrado.");
                            }
                        }}>
                            Eliminar
                        </button>



                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorias;
