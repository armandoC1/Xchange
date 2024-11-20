import axiosInstance from "./axiosInstance";

export const mostrarSolicitudes = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get('/solicitudes/listPage', {
            params: {
                page: page -1,
                size: limit,
            },
        })
        console.log('datos desde solicitud service: ', response.data)
        return response.data
    } catch (error) {
        if (error.response && error.response.status == 404){
            console.warn('No hay solcitudes disponibles')
            return { content: [], totalElements: 0, totalPages: 0 };
        }
        console.error('Error al cargar las solicitudes', error)
        throw new Error('Error al cargar las solicitudes')
    }
}

export const obtenerPorId = async (idSolicitud) => {
    try {
        const response = await axiosInstance.get(`/solicitudes/findById/${idSolicitud}`)
        return response.data
    } catch (error) {
        console.error('Error al obtener la solicitud: ', error)
        throw Error
    }
}
export const eliminarSolicitud = async (idSolicitud) => {
    try {
        const response = await axiosInstance.delete(`/solicitudes/delete/${idSolicitud}`)
        return response.status == 200
    } catch (error) {
        console.error('Error al obtener la solicitud: ', error)
        throw Error
    }
}