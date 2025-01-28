'use client'
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { obtenerOfertasPorUsuario, eliminar } from "@/app/services/ofertasService";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from 'next/link'

interface Oferta {
  idOferta: number;
  titulo: string;
  descripcion: string;
  condicion: string;
  ubicacion: string;
  imagenes: string[];
  idCategoria: number;
  idUsuario: number;
  estado: string;
}

export default function MisOfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todas");
  const router = useRouter();

  const fetchMisOfertas = async () => {
    const idUsuario = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");

    if (!idUsuario || !token) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No tienes un token o ID de usuario válido. Por favor, inicia sesión.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await obtenerOfertasPorUsuario(idUsuario);
      setOfertas(response);
    } catch (error) {
      console.error("Error al cargar las ofertas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar tus ofertas. Revisa tu conexión o contacta al soporte.",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarOferta = async (idOferta: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminada, esta oferta no se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const response = await eliminar(idOferta);
      if (response) {
        Swal.fire("Eliminado", "La oferta ha sido eliminada con éxito.", "success");
        setOfertas((prevOfertas) => prevOfertas.filter((oferta) => oferta.idOferta !== idOferta));
      }
    } catch (error) {
      console.error("Error al eliminar la oferta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar la oferta. Inténtalo nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoOferta = async (idOferta: number, nuevoEstado: string) => {
    try {
      const oferta = ofertas.find((o) => o.idOferta === idOferta);

      if (oferta) {
        const formData = new FormData();
        formData.append(
          "oferta",
          new Blob([JSON.stringify({ ...oferta, estado: nuevoEstado })], {
            type: "application/json",
          })
        );

        if (oferta.imagenes && oferta.imagenes.length > 0) {
          oferta.imagenes.forEach((imagen, index) => {
            const base64String = imagen.startsWith("data:image/") ? imagen.split(",")[1] : imagen;

            try {
              const byteCharacters = atob(base64String);
              const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "image/jpeg" });

              formData.append("imagenes", blob, `imagen-${index}.jpeg`);
            } catch (error) {
              console.error("Error al procesar la imagen base64", error);
            }
          });
        }

        const res = await fetch(`https://xchange-api-production.up.railway.app/ofertas/edit/${idOferta}`, {
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
            text: `La oferta ha sido marcada como ${nuevoEstado}.`,
          });

          setOfertas((prevOfertas) =>
            prevOfertas.map((oferta) =>
              oferta.idOferta === idOferta ? { ...oferta, estado: nuevoEstado } : oferta
            )
          );
        } else {
          console.error("Error al actualizar la oferta:", await res.text());
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo actualizar la oferta.",
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la oferta.",
      });
    }
  };

  useEffect(() => {
    fetchMisOfertas();
  }, []);

  const ofertasFiltradas = ofertas.filter((oferta) => {
    if (estadoFiltro === "todas") return true;
    return oferta.estado === estadoFiltro;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-8"
        >
          Mis Ofertas
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex space-x-2"
        >
          {["todas", "activa", "inactiva"].map((estado) => (
            <button
              key={estado}
              onClick={() => setEstadoFiltro(estado)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${estadoFiltro === estado
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : ofertasFiltradas.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ofertasFiltradas.map((oferta, index) => (
              <motion.div
                key={oferta.idOferta}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  {oferta.imagenes && oferta.imagenes.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
                      alt={oferta.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                    {oferta.estado}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{oferta.titulo}</h2>
                  <p className="text-gray-600 text-sm mb-4">{oferta.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => eliminarOferta(oferta.idOferta)}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() =>
                        actualizarEstadoOferta(oferta.idOferta, oferta.estado === "activa" ? "inactiva" : "activa")
                      }
                      className="px-4 py-2 text-sm text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      {oferta.estado === "activa" ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                  <Link href={`/ofertas/ver/${oferta.idOferta}`}>
                    <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                      Ver detalles
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No tienes ofertas creadas aún.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

