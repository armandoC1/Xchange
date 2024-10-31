"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { eliminarCategoria } from '@/app/services/categoriaService';

interface Categoria {
    idCategoria: number;
    nombre: string;
}
const EliminarCategoria = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    console.log("ID recibido en EliminarCategoria:", id);
    const numericId = id ? Number(id) : null;

    useEffect(() => {
        if (numericId) {
            const eliminarCategoriaPorId = async () => {
                try {
                    console.log("Intentando eliminar categoría con ID:", numericId);
                    await eliminarCategoria(numericId);
                    alert("Categoría eliminada con éxito");
                    router.push("/categorias");
                } catch (error) {
                    console.error("Error eliminando categoría:", error);
                    setError("Error eliminando la categoría. Asegúrate de tener permisos y que el ID es correcto.");
                }
            };
            eliminarCategoriaPorId();
        } else {
            console.error("ID de categoría inválido o no encontrado en la URL");
            setError("ID de categoría inválido o no encontrado en la URL");
        }
    }, [numericId, router]);


    return (
        <div>
            <h1>Eliminar Categoría</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <p>La categoría está siendo eliminada...</p>
            )}
        </div>
    );
};

export default EliminarCategoria;
