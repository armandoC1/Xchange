"use client";
import { useEffect, useState } from 'react';
import { obtenerTodasCategorias, eliminarCategoria } from '../services/categoriaService';
import FormularioCategoria from '../components/FormularioCategoria';

interface Categoria {
    idCategoria: number;
    nombre: string;
}

const Categorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    const handleEliminar = async (id: number) => {
        try {
            await eliminarCategoria(id);
            setCategorias(categorias.filter((categoria: Categoria) => categoria.idCategoria !== id));
            alert("Categoría eliminada con éxito");
        } catch (error) {
            console.error("Error eliminando categoría:", error);
            alert("No se pudo eliminar la categoría");
        }
    };

    const handleCategoriaCreada = (categoria: Categoria) => {
        setCategorias([...categorias, categoria]);
    };

    return (
        <div>
            <h1>Listado de Categorías</h1>
            <FormularioCategoria onCategoriaCreada={handleCategoriaCreada} />
            {error && <p>{error}</p>}
            <ul>
                {categorias.map((categoria: Categoria) => (
                    <li key={categoria.idCategoria}>
                        {categoria.nombre}
                        <button onClick={() => handleEliminar(categoria.idCategoria)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorias;
