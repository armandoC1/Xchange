'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPorId } from '@/app/services/ofertasService';
import { obtenerUsuarioPorId } from '@/app/services/usuarioService';
import { obtenerCategoriaPorId } from '@/app/services/categoriaService';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle, MapPin, Tag, User, Package2 } from 'lucide-react';
import Swal from 'sweetalert2';

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchOferta = async () => {
                Swal.fire({
                    title: 'Cargando...',
                    html: 'Obteniendo detalles del producto',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const data = await obtenerPorId(id);
                    sessionStorage.setItem('idOferta', id.toString());
                    setOferta(data);
                    
                    if (data.idUsuario) {
                        const usuario = await obtenerUsuarioPorId(data.idUsuario);
                        sessionStorage.setItem('idDestinatario', data.idUsuario);
                        setUsuarioNombre(usuario.nombre);
                    }
                    if (data.idCategoria) {
                        const categoria = await obtenerCategoriaPorId(data.idCategoria);
                        setCategoriaNombre(categoria.nombre);
                    }
                    Swal.close();
                } catch (error) {
                    console.error('Error al cargar la oferta:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar la oferta'
                    });
                }
            };

            fetchOferta();
        }
    }, [id]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === oferta?.imagenes.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? (oferta?.imagenes.length ?? 1) - 1 : prev - 1
        );
    };

    if (!oferta) return null;

    return (
        <main className="min-h-screen from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="from-slate-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative">
                            {oferta.imagenes && oferta.imagenes.length > 0 && (
                                <div className="relative h-[500px]">
                                    <img
                                        src={`data:image/jpeg;base64,${oferta.imagenes[currentImageIndex]}`}
                                        alt={`Imagen de ${oferta.titulo}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {oferta.imagenes.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all transform hover:scale-110"
                                                aria-label="Imagen anterior"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button 
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all transform hover:scale-110"
                                                aria-label="Siguiente imagen"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                                {oferta.imagenes.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                            index === currentImageIndex 
                                                                ? 'bg-white scale-125' 
                                                                : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-6 md:p-8 lg:p-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                {oferta.titulo}
                            </h1>
                            
                            <div className="space-y-6 mb-8">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h2 className="font-semibold text-gray-900 mb-3">Descripción</h2>
                                    <p className="text-gray-600 leading-relaxed">{oferta.descripcion}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <Package2 className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Condición</h3>
                                            <p className="text-gray-900 font-medium">{oferta.condicion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                                            <p className="text-gray-900 font-medium">{oferta.ubicacion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <Tag className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                                            <p className="text-gray-900 font-medium">
                                                {categoriaNombre || "Cargando categoría..."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <User className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Publicado por</h3>
                                            <p className="text-gray-900 font-medium">
                                                {usuarioNombre || "Cargando usuario..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/chat/privado" className="block">
                                <button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3">
                                    <MessageCircle className="w-6 h-6" />
                                    <span className="text-lg">Me interesa</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}