'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { obtenerCategoriaPorId, actualizarCategoria } from '@/app/services/categoriaService';

interface Categoria {
    id: number;
    nombre: string;
}

export default function CategoriaDetallesPage() {
    const { id } = useParams();
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [nombre, setNombre] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            const fetchCategoria = async () => {
                try {
                    const data = await obtenerCategoriaPorId(Number(id));
                    setCategoria(data);
                    setNombre(data.nombre);
                } catch (error) {
                    console.error('Error al cargar la categoría', error);
                    setMessage('Error al cargar la categoría');
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
                        title: 'Éxito',
                        text: 'Categoría actualizada exitosamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        router.push('/categorias'); // Redirige a la lista de categorías después de confirmar
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al actualizar la categoría.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                console.error('Error al actualizar la categoría:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar la categoría.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };

    if (!categoria) return <p>Cargando categoría...</p>;

    return (
        <div>
            <h1>Editar categoría</h1>
            {message && <p>{message}</p>}
            <br />
            <label htmlFor="nombre">Nombre de la categoría: </label>
            <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-gray-300 rounded p-2"
            />
            <button
                onClick={handleGuardarCambios}
                className="bg-blue-500 text-white p-2 rounded mt-2"
            >
                Guardar cambios
            </button>
        </div>
    );
}
