import axiosInstance from './axiosInstance';

export const obtenerUsuarioPorId = async (idUsuario) => {
    try {
        const response = await axiosInstance.get(`/usuarios/find/${idUsuario}`);
        return response.data; // Debería incluir el nombre del usuario
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};