// pages/ofertas.tsx
'use client';

import { useState, useEffect } from 'react';
import { listadoPaginado } from '../services/ofertasService';

interface Oferta {
    id: number;
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
                const data = await listadoPaginado(page, limit);
                setOfertas(data); 
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
                <ul>
                    {ofertas.map(oferta => (
                        <li key={oferta.id}>
                            <h2>{oferta.titulo}</h2>
                            <p>{oferta.descripcion}</p>
                            <p>Condición: {oferta.condicion}</p>
                            <p>Ubicación: {oferta.ubicacion}</p>
                            {oferta.imagenes && oferta.imagenes.length > 0 && (
                                <div>
                                    <h3>Imágenes:</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {oferta.imagenes.map((imagenBase64, index) => (
                                            <img 
                                                key={index} 
                                                src={`data:image/jpeg;base64,${imagenBase64}`} 
                                                alt={`Imagen de ${oferta.titulo}`} 
                                                style={{ width: '100px', height: 'auto' }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay ofertas disponibles.</p>
            )}
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Anterior
                </button>
                <span>Página {page}</span>
                <button onClick={handleNextPage}>Siguiente</button>
            </div>
        </div>
    );
}
