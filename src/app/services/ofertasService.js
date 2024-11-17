import axiosInstance from "./axiosInstance";

export const listadoPaginado = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get('/ofertas/listPage', {
            params: {
                page: page - 1,
                size: limit,
            },
        });

        if (!response.data || !response.data.content) {
            console.warn('No hay ofertas disponibles.');
            return { content: [], totalElements: 0, totalPages: 0 };
        }

        return response.data;
    } catch (error) {
        console.error('Error al cargar las ofertas:', error);
        throw new Error('Error al conectar con el servidor.');
    }
};


//ya funciona
export const obtenerPorId = async (idOferta) => {
    try {
        const token = sessionStorage.getItem('token');

        const response = await axiosInstance.get(`/ofertas/findById/${idOferta}`);

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Oferta no encontrada');
            return null;
        } else {
            console.error('Error al obtener la oferta:', error);
            throw error;
        }
    }
};

//modificado para estar similar al de guardar oferta
export const editarOferta = async (ofertaData, idOferta) => {
    try {
        const response = await axiosInstance.put(`/edit/${idOferta}`, {
            oferta: {
                titulo: ofertaData.titulo,
                descripcion: ofertaData.descripcion,
                condicion: ofertaData.condicion,
                ubicacion: ofertaData.ubicacion,
                imagenes: ofertaData.imagenes, //estar pendiente que podria cambiar
                idCategoria: ofertaData.idCategoria,
                idUsuario: ofertaData.idUsuario
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar la oferta', error);
        throw error;
    }
}

export const guardarOferta = async (ofertaData) => {
    try {
        const respónse = await axiosInstance.post('/ofertas/save', {
            oferta: {
                titulo: ofertaData.titulo,
                descripcion: ofertaData.descripcion,
                condicion: ofertaData.condicion,
                ubicacion: ofertaData.ubicacion,
                imagenes: ofertaData.imagenes,
                idUsuario: ofertaData.idUsuario

            }
        })

        return response.data
    } catch (error) {
        console.error('Error al registrar ofertas: ', error)
        throw error
    }
}

// aun no
export const obtenerPorTitulo = async (titulo) => {
    try {
        const response = await axiosInstance.get(`/ofertas/findByTitle/${titulo}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Oferta no encontrada');
            return null;
        } else {
            console.error('Error al obtener la oferta:', error);
            throw error;
        }
    }
}

//aun no
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




