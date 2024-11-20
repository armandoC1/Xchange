// "use client";

// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { obtenerOfertasPorUsuario } from "@/app/services/ofertasService";

// interface Oferta {
//   idOferta: number;
//   titulo: string;
//   descripcion: string;
//   condicion: string;
//   ubicacion: string;
//   imagenes: string[];
//   idCategoria: number;
//   idUsuario: number;
// }

// export default function MisOfertasPage() {
//   const [ofertas, setOfertas] = useState<Oferta[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMisOfertas = async () => {
//     const idUsuario = sessionStorage.getItem("idUsuario");
//     const token = sessionStorage.getItem("token");

//     if (!idUsuario || !token) {
//       Swal.fire({
//         icon: "error",
//         title: "Error de autenticación",
//         text: "No tienes un token o ID de usuario válido. Por favor, inicia sesión.",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await obtenerOfertasPorUsuario(idUsuario);
//       setOfertas(response);
//     } catch (error) {
//       console.error("Error al cargar las ofertas:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "No se pudieron cargar tus ofertas. Revisa tu conexión o contacta al soporte.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchMisOfertas();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
//           Mis Ofertas
//         </h1>

//         {loading ? (
//           <div className="flex justify-center items-center h-96">
//             <div className="relative w-24 h-24">
//               <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
//               <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         ) : ofertas.length > 0 ? (
//           <div className="grid grid-cols-1 gap-6 mt-6">
//             {ofertas.map((oferta) => (
//               <div
//                 key={oferta.idOferta}
//                 className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl"
//               >
//                 <div className="flex">
//                   <div className="flex-shrink-0 w-1/3">
//                     {oferta.imagenes && oferta.imagenes.length > 0 ? (
//                       <img
//                         src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
//                         alt={oferta.titulo}
//                         className="w-full h-32 object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
//                         <span className="text-gray-400">Sin imagen</span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 p-4">
//                     <h2 className="text-xl font-bold text-gray-800">{oferta.titulo}</h2>
//                     <p className="text-gray-600">{oferta.descripcion}</p>
//                     <div className="flex justify-between items-center mt-4">

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No tienes ofertas creadas aún.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { obtenerOfertasPorUsuario, eliminar } from "@/app/services/ofertasService";

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

export default function MisOfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Filtra la oferta eliminada del estado
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

  useEffect(() => {
    fetchMisOfertas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Mis Ofertas
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : ofertas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mt-6">
            {ofertas.map((oferta) => (
              <div
                key={oferta.idOferta}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                <div className="flex">
                  <div className="flex-shrink-0 w-1/3">
                    {oferta.imagenes && oferta.imagenes.length > 0 ? (
                      <img
                        src={`data:image/jpeg;base64,${oferta.imagenes[0]}`}
                        alt={oferta.titulo}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <h2 className="text-xl font-bold text-gray-800">{oferta.titulo}</h2>
                    <p className="text-gray-600">{oferta.descripcion}</p>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => eliminarOferta(oferta.idOferta)}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No tienes ofertas creadas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
