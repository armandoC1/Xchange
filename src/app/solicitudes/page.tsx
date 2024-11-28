"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { mostrarSolicitudes, eliminarSolicitud } from "../services/solicitudesService";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

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
//sessionStorage 

export default function SolicitudesPage() {
    const [userId, setUserId] = useState<number>(0); // Inicialmente, valor 0
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [page, setPage] = useState(1);
    const [totalSolicitudes, setTotalSolicitudes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("recibidas");
    const [estadoFilter, setEstadoFilter] = useState("activo");

    const limit = 5;

    useEffect(() => {
        
        const storedUserId = sessionStorage.getItem("idUsuario");
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);
    
    useEffect(() => {
        const fetchSolicitudes = async () => {
            setLoading(true);
            try {
                const response = await mostrarSolicitudes(page, limit);

                if (response && response.content) {
                    const filteredSolicitudes = response.content.filter((solicitud: Solicitud) => {
                        const isCorrectType = filterType === "recibidas"
                            ? solicitud.idDestinatario === userId
                            : solicitud.idSolicitante === userId;
                        return isCorrectType && solicitud.estado === estadoFilter;
                    });

                    setSolicitudes(filteredSolicitudes);
                    setTotalSolicitudes(response.totalElements);
                } else {
                    setSolicitudes([]);
                    setTotalSolicitudes(0);
                    Swal.fire({
                        icon: "warning",
                        title: "Sin resultados",
                        text: "No hay solicitudes disponibles.",
                        background: "#fff",
                        confirmButtonColor: "#3B82F6",
                    });
                }
            } catch (error) {
                console.error("Error al cargar las solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, [page, userId, filterType, estadoFilter]);

    const totalPages = Math.ceil(totalSolicitudes / limit);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setPage(1);
    };

    const handleEstadoChange = (estado: string) => {
        setEstadoFilter(estado);
        setPage(1);
    };

    const actualizarEstadoSolicitud = async (idSolicitud: number, nuevoEstado: string) => {
        try {
            const solicitud = solicitudes.find((s) => s.idSolicitud === idSolicitud);
            if (!solicitud) {
                console.error("No se encontró la solicitud con ID:", idSolicitud);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo encontrar la solicitud para actualizar.",
                });
                return;
            }
            const formData = new FormData();
            formData.append(
                "solicitud",
                new Blob([JSON.stringify({ ...solicitud, estado: nuevoEstado })], {
                    type: "application/json",
                })
            );

            solicitud.imagenes.forEach((imagen, index) => {
                const base64String = imagen.startsWith("data:image/")
                    ? imagen.split(",")[1]
                    : imagen;

                const byteCharacters = atob(base64String);
                const byteNumbers = Array.from(byteCharacters).map((char) =>
                    char.charCodeAt(0)
                );
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/jpeg" });

                formData.append("imagenes", blob, `imagen-${index}.jpeg`);
            });

            const res = await fetch(`http://api.xchangesv.es:8080/solicitudes/edit/${idSolicitud}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: `La solicitud ha sido marcada como ${nuevoEstado}.`,
                });
                setSolicitudes((prev) =>
                    prev.map((s) =>
                        s.idSolicitud === idSolicitud ? { ...s, estado: nuevoEstado } : s
                    )
                );
            } else {
                console.error("Error al actualizar la solicitud:", await res.text());
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo actualizar la solicitud.",
                });
            }
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al actualizar la solicitud.",
            });
        }
    };

    const handleDelete = async (idSolicitud: number) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará la solicitud permanentemente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                await eliminarSolicitud(idSolicitud);
                setSolicitudes((prev) => prev.filter((solicitud) => solicitud.idSolicitud !== idSolicitud));
                Swal.fire("¡Eliminada!", "La solicitud ha sido eliminada.", "success");
            }
        } catch (error) {
            console.error("Error al eliminar la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al eliminar la solicitud. Inténtalo nuevamente.",
            });
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                        {filterType === "recibidas" ? "Solicitudes Recibidas" : "Solicitudes Enviadas"}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => handleFilterChange("recibidas")}
                            className={`px-4 py-2 rounded-full transition-all duration-300 ${
                                filterType === "recibidas"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Recibidas
                        </button>
                        <button
                            onClick={() => handleFilterChange("enviadas")}
                            className={`px-4 py-2 rounded-full transition-all duration-300 ${
                                filterType === "enviadas"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Enviadas
                        </button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <select
                        value={estadoFilter}
                        onChange={(e) => handleEstadoChange(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                        <option value="activo">Activas</option>
                        <option value="en proceso">En Proceso</option>
                        <option value="finalizado">Finalizadas</option>
                        <option value="cancelado">Canceladas</option>
                    </select>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {solicitudes.length > 0 ? (
                            solicitudes.map((solicitud, index) => (
                                <motion.div
                                    key={solicitud.idSolicitud}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <img
                                            src={`data:image/jpeg;base64,${solicitud.imagenes[0]}`}
                                            alt="Imagen"
                                            className="w-full sm:w-32 h-32 rounded-lg object-cover mb-4 sm:mb-0 sm:mr-6"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{solicitud.titulo}</h2>
                                            <p className="text-gray-600 mb-2">{solicitud.descripcion}</p>
                                            <p className="text-sm font-medium text-blue-600 mb-4">Estado: {solicitud.estado}</p>
                                            {solicitud.estado === "finalizado" && (
                                                <p className="text-yellow-500 font-semibold mb-4">
                                                    Recuerda deshabilitar tu oferta.
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-2">
                                                <Link href={`/solicitudes/ver/${solicitud.idSolicitud}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300">
                                                        Ver
                                                    </button>
                                                </Link>
                                                {solicitud.estado === "en proceso" && (
                                                    <button
                                                        onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "finalizado")}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                                                    >
                                                        Confirmar
                                                    </button>
                                                )}
                                                {filterType === "recibidas" && solicitud.estado === "activo" && (
                                                    <>
                                                        <button
                                                            onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "en proceso")}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                                                        >
                                                            Aceptar
                                                        </button>
                                                        <button
                                                            onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "cancelado")}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center text-gray-500 text-lg"
                            >
                                No hay solicitudes disponibles.
                            </motion.p>
                        )}
                    </AnimatePresence>
                )}

                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 flex justify-center items-center space-x-4"
                    >
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="text-gray-700 font-medium">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page >= totalPages}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

