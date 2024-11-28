import axiosInstance from './axiosInstance';

export const obtenerUsuarioPorId = async (idUsuario) => {
    try {
        const response = await axiosInstance.get(`/usuarios/findById/${idUsuario}`);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};