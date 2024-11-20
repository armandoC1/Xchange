"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { mostrarSolicitudes, eliminarSolicitud } from "../services/solicitudesService";
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

export default function SolicitudesPage() {
    const initialUserId = parseInt(sessionStorage.getItem("idUsuario") || "0");
    const [userId, setUserId] = useState<number>(initialUserId);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [page, setPage] = useState(1);
    const [totalSolicitudes, setTotalSolicitudes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("recibidas"); // Recibidas por defecto
    const [estadoFilter, setEstadoFilter] = useState("activo");

    const limit = 5;

    useEffect(() => {
        const fetchSolicitudes = async () => {
            setLoading(true);
            try {
                const response = await mostrarSolicitudes(page, limit);

                if (response && response.content) {
                    let filteredSolicitudes = response.content.filter(
                        (solicitud: Solicitud) =>
                            (filterType === "recibidas"
                                ? solicitud.idDestinatario === userId
                                : solicitud.idSolicitante === userId) &&
                            solicitud.estado === estadoFilter
                    );

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
            console.log("Datos a actualizar", solicitud);
            if (solicitud) {
                const formData = new FormData();

                // Adjuntar el JSON como solicitud
                formData.append(
                    "solicitud",
                    new Blob([JSON.stringify({ ...solicitud, estado: nuevoEstado })], {
                        type: "application/json",
                    })
                );

                // Adjuntar imágenes como archivos Blob
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

                console.log("FormData antes de enviar:", Array.from(formData.entries()));

                // Realizar la solicitud
                const res = await fetch(`http://localhost:8080/solicitudes/edit/${idSolicitud}`, {
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
                Swal.fire("¡Eliminada!", "La solicitud ha sido eliminada.", "success");
                setSolicitudes((prev) =>
                    prev.filter((solicitud) => solicitud.idSolicitud !== idSolicitud)
                );
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {filterType === "recibidas" ? "Solicitudes Recibidas" : "Solicitudes Enviadas"}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => handleFilterChange("recibidas")}
                            className={`px-4 py-2 rounded-md ${filterType === "recibidas"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Recibidas
                        </button>
                        <button
                            onClick={() => handleFilterChange("enviadas")}
                            className={`px-4 py-2 rounded-md ${filterType === "enviadas"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Enviadas
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <select
                        value={estadoFilter}
                        onChange={(e) => handleEstadoChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="activo">Activas</option>
                        <option value="en proceso">En Proceso</option>
                        <option value="finalizado">Finalizadas</option>
                        <option value="cancelado">Canceladas</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-center">Cargando...</p>
                ) : solicitudes.length > 0 ? (
                    solicitudes.map((solicitud) => (
                        <div key={solicitud.idSolicitud} className="bg-white p-4 rounded-md shadow-md mb-4">
                            <div className="flex items-center">
                                <img
                                    src={`data:image/jpeg;base64,${solicitud.imagenes[0]}`}
                                    alt="Imagen"
                                    className="w-24 h-24 rounded-md"
                                />
                                <div className="ml-4">
                                    <h2 className="text-xl font-bold">{solicitud.titulo}</h2>
                                    <p>{solicitud.descripcion}</p>
                                    <p className="text-gray-600">Estado: {solicitud.estado}</p>
                                    {/* Mostrar mensaje si está finalizado */}
                                    {solicitud.estado === "finalizado" && (
                                        <p className="mt-2 text-yellow-500 font-semibold">
                                            Recuerda deshabilitar tu oferta.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 space-x-2">
                                <Link href={`/solicitudes/ver/${solicitud.idSolicitud}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                        Ver
                                    </button>
                                </Link>
                                {solicitud.estado === "en proceso" && (
                                    <button
                                        onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "finalizado")}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Confirmar
                                    </button>
                                )}
                                {filterType === "recibidas" && solicitud.estado === "activo" && (
                                    <>
                                        <button
                                            onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "en proceso")}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            onClick={() => actualizarEstadoSolicitud(solicitud.idSolicitud, "cancelado")}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Rechazar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay solicitudes disponibles.</p>
                )}

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Anterior
                        </button>
                        <span>
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page >= totalPages}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
