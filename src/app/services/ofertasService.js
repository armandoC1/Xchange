import axiosInstance from "./axiosInstance";
import Swal from 'sweetalert2';

export const listadoPaginado = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get('/ofertas/listPage', {
            params: {
                page: page - 1,
                size: limit
            }
        });
        if (!response.data) {
            alert('No hay ofertas disponibles - Ofertas no disponibles');
        }
        return response.data;
    } catch (error) {
        console.log('Error al cargar las categorias', error);
        throw error;
    }
};


export const guardarOferta = async (ofertaData) => {
    try {
      const formData = new FormData();
      formData.append("titulo", ofertaData.titulo);
      formData.append("descripcion", ofertaData.descripcion);
      formData.append("condicion", ofertaData.condicion);
      formData.append("ubicacion", ofertaData.ubicacion);
      formData.append("idCategoria", ofertaData.idCategoria);
      formData.append("idUsuario", ofertaData.idUsuario);
  
      if (Array.isArray(ofertaData.imagenes) && ofertaData.imagenes.length > 0) {
        ofertaData.imagenes.forEach((imagen) => {
          formData.append("imagenes", imagen);
        });
      }
  
      const token = sessionStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Token de autenticación no encontrado o ha expirado. Por favor, inicia sesión de nuevo.',
        });
        return;
      }
  
      const response = await axiosInstance.post('/ofertas/save', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Agrega el token manualmente aquí
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al registrar la oferta:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la oferta. Verifica los datos e inténtalo de nuevo.',
        confirmButtonColor: '#3B82F6',
      });
  
      throw error;
    }
  };

export const eliminar = async (idOferta) => {
    try {
        const response = await axiosInstance.delete(`/ofertas/delete/${idOferta}`);
        return response.status === 200;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Oferta no encontrada');
            return null;
        } else {
            console.error('Error al borrar la oferta:', error);
            throw error;
        }
    }
};

// import axiosInstance from "./axiosInstance";

// export const listadoPaginado = async (page = 1, limit = 10) => {
//     try {
//         const response = await axiosInstance.get('/ofertas/listPage', {
//             params: {
//                 page: page - 1,
//                 size: limit
//             }
//         });
//         if (!response.data) {
//             alert('No hay ofertas disponibles - Ofertas no disponibles');
//         }
//         return response.data;
//     } catch (error) {
//         console.log('Error al cargar las categorias', error);
//         throw error;
//     }
// }

// export const guardarOferta = async (ofertaData) => {
//     try {
//         const response = await axiosInstance.post('/ofertas/save', {
//             titulo: ofertaData.titulo,
//             descripcion: ofertaData.titulo,
//             condicion: ofertaData.condicion,
//             ubicacion: ofertaData.ubicacion,
//             imagenes: ofertaData.imagenes,
//             idCategoria: ofertaData.idCategoria,
//             idUsuario: ofertaData.idUsuario
//         });
//         return response.data;
//     } catch (error) {
//         console.log('Error al registrar la oferta', error);
//         throw error;
//     }
// }

// export const obtenerPorId = async (idOferta) => {
//     try {
//         const token = sessionStorage.getItem('token');

//         const response = await axiosInstance.get(`/ofertas/findById/${idOferta}`);

//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             console.error('Oferta no encontrada');
//             return null;
//         } else {
//             console.error('Error al obtener la oferta:', error);
//             throw error;
//         }
//     }
// };

// export const editarOferta = async (ofertaData, idOferta) => {
//     try {
//         const response = await axiosInstance.put(`/edit/${idOferta}`, {
//             // idOferta: ofertaData.idOferta,
//             titulo: ofertaData.titulo,
//             descripcion: ofertaData.titulo,
//             condicion: ofertaData.condicion,
//             ubicacion: ofertaData.ubicacion,
//             imagenes: ofertaData.imagenes,
//             idCategoria: ofertaData.idCategoria,
//             idUsuario: ofertaData.idUsuario
//         });
//         return response.data;
//     } catch (error) {
//         console.log('Error al registrar la oferta', error);
//         throw error;
//     }
// }

// export const obtenerPorTitulo = async (titulo) => {
//     try {
//         const response = await axiosInstance.get(`/findByTitle/${titulo}`);
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             console.error('Oferta no encontrada');
//             return null;
//         } else {
//             console.error('Error al obtener la oferta:', error);
//             throw error;
//         }
//     }
// }

// export const eliminar = async (idOferta) => {
//     try {
//         const response = await axiosInstance.delete(`/delete/${idOferta}`);
//         return response.status == 200;
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             console.error('Oferta no encontrada');
//             return null;
//         } else {
//             console.error('Error al borrar la oferta:', error);
//             throw error;
//         }
//     }
// }