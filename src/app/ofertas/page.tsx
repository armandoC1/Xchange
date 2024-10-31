// pages/ofertas.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { listadoPaginado } from '../services/ofertasService';

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

export default function OfertasPage() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const response = await listadoPaginado(page, limit);
                setOfertas(response.content);
            } catch (error) {
                console.error('Error al cargar las ofertas:', error);
            }
        };

        fetchOfertas();
    }, [page]);

    const handleNextPage = () => setPage(prevPage => prevPage + 1);
    const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

    return (
        <div>
            <h1>Ofertas</h1>
            {ofertas.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {ofertas.map(oferta => (
                        <div key={oferta.idOferta} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <h2>{oferta.titulo}</h2>
                            <p>{oferta.descripcion}</p>
                            {oferta.imagenes && oferta.imagenes.length > 0 && (
                                <img
                                    src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
                                    alt={`Imagen de ${oferta.titulo}`}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                />
                            )}
                            <p>Ubicación: {oferta.ubicacion}</p>
                            <Link href={`/ofertas/ver/${oferta.idOferta}`}>
                                <button style={{ marginTop: '10px', padding: '10px 15px', cursor: 'pointer' }}>Ver detalles</button>
                            </Link>

                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay ofertas disponibles.</p>
            )}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Anterior
                </button>
                <span style={{ margin: '0 10px' }}>Página {page}</span>
                <button onClick={handleNextPage}>Siguiente</button>
            </div>
        </div>
    );
}
