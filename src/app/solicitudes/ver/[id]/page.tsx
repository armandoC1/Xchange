"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { obtenerPorId } from "../../../services/solicitudesService";
import { obtenerUsuarioPorId } from "../../../services/usuarioService"; 
import Swal from "sweetalert2";

interface Solicitud {
    idSolicitud: number;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    idCategoria: number;
    idSolicitante: number;
    idDestinatario: number;
    estado: string;
    imagenes: string[];
    fechaCreacion: string;
}

export default function SolicitudDetalles() {
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [usuario, setUsuario] = useState<string | null>(null); 
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    useEffect(() => {
        const fetchSolicitud = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await obtenerPorId(Number(id));
                setSolicitud(data);

                const usuarioData = await obtenerUsuarioPorId(data.idSolicitante);
                setUsuario(usuarioData.nombre); 
            } catch (error) {
                console.error("Error al cargar la solicitud:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la solicitud. Inténtalo más tarde.",
                });
                router.push("/solicitudes");
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitud();
    }, [id, router]);

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % (solicitud?.imagenes?.length || 1));
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + (solicitud?.imagenes?.length || 1)) % (solicitud?.imagenes?.length || 1));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="animate-pulse bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full">
                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                    <div className="aspect-video bg-slate-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                        <div className="h-10 bg-slate-200 rounded w-24"></div>
                        <div className="h-10 bg-slate-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!solicitud) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <p className="text-gray-500 text-lg font-light">No se encontraron detalles para esta solicitud.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden  w-70& h-full">
                <div className="relative aspect-video">
                    <img
                        src={`data:image/jpeg;base64,${solicitud.imagenes[activeImage]}`}
                        alt={`Imagen ${activeImage + 1} de la solicitud`}
                        className="object-cover w-full h-full"
                    />
                    {solicitud.imagenes.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
                                aria-label="Imagen anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
                                aria-label="Siguiente imagen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{solicitud.titulo}</h1>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {solicitud.ubicacion}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(solicitud.fechaCreacion).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {usuario ? usuario : "Cargando..."}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            solicitud.estado === "activo" ? "bg-green-100 text-green-800" :
                            solicitud.estado === "en proceso" ? "bg-yellow-100 text-yellow-800" :
                            solicitud.estado === "finalizado" ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                        }`}>
                            {solicitud.estado || "Pendiente"}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-6"><span>Descripcion: </span>{solicitud.descripcion}</p>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push("/solicitudes")}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        >
                            Volver a la lista
                        </button>
                        <div className="flex gap-2">
                            {solicitud.imagenes.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-3 h-3 rounded-full ${index === activeImage ? "bg-blue-500" : "bg-gray-300"}`}
                                    aria-label={`Ver imagen ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
