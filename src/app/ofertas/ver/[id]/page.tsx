// src/app/ofertas/ver/[id].tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPorId } from '@/app/services/ofertasService';
import { obtenerUsuarioPorId } from '@/app/services/usuarioService';
import { obtenerCategoriaPorId } from '@/app/services/categoriaService';

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

export default function OfertaDetallesPage() {
    const { id } = useParams();
    const [oferta, setOferta] = useState<Oferta | null>(null);
    const [usuarioNombre, setUsuarioNombre] = useState<string | null>(null);
    const [categoriaNombre, setCategoriaNombre] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchOferta = async () => {
                try {
                    const data = await obtenerPorId(id);
                    setOferta(data);

                    // Obtener el nombre del usuario y de la categoría usando los IDs de la oferta
                    if (data.idUsuario) {
                        const usuario = await obtenerUsuarioPorId(data.idUsuario);
                        setUsuarioNombre(usuario.nombre); // Asegúrate de que `usuario` tenga un campo `nombre`
                    }
                    if (data.idCategoria) {
                        const categoria = await obtenerCategoriaPorId(data.idCategoria);
                        setCategoriaNombre(categoria.nombre); // Asegúrate de que `categoria` tenga un campo `nombre`
                    }
                } catch (error) {
                    console.error('Error al cargar la oferta:', error);
                }
            };

            fetchOferta();
        }
    }, [id]);

    if (!oferta) return <p>Cargando oferta...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{oferta.titulo}</h1>
            <p>{oferta.descripcion}</p>
            <p>Condición: {oferta.condicion}</p>
            <p>Ubicación: {oferta.ubicacion}</p>
            <p>Categoría: {categoriaNombre || "Cargando categoría..."}</p>
            <p>Publicado por: {usuarioNombre || "Cargando usuario..."}</p>

            {oferta.imagenes && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {oferta.imagenes.map((imagenBase64, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${imagenBase64}`}
                            alt={`Imagen de ${oferta.titulo}`}
                            style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
