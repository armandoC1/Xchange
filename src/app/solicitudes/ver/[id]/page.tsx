"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { obtenerPorId } from "../../../services/solicitudesService";
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
}

export default function SolicitudDetalles() {
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                setLoading(true);
                const data = await obtenerPorId(Number(id));
                setSolicitud(data);
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

        if (id) fetchSolicitud();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!solicitud) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-500 text-lg">No se encontraron detalles para esta solicitud.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{solicitud.titulo}</h1>
                <p className="text-gray-600 mb-6">Descripcion: {solicitud.descripcion}</p>
                <div className="mb-6">
                    <strong>Ubicación:</strong> <span>{solicitud.ubicacion}</span>
                </div>
                <div className="mb-6">
                    <strong>Estado:</strong> <span>{solicitud.estado || "Pendiente"}</span>
                </div>
                <div className="mb-6">
                    <strong>Imágenes:</strong>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {solicitud.imagenes && solicitud.imagenes.length > 0 ? (
                            solicitud.imagenes.map((imagen, index) => (
                                <img
                                    key={index}
                                    src={`data:image/jpeg;base64,${imagen}`}
                                    alt={`Imagen ${index + 1}`}
                                    className="rounded-lg object-cover"
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No hay imágenes disponibles.</p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => router.push("/solicitudes")}
                        className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    );
}
