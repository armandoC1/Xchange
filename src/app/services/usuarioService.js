import axiosInstance from './axiosInstance';

//funciona
export const obtenerUsuarioPorId = async (idUsuario) => {
    try {
        const response = await axiosInstance.get(`/usuarios/findById/${idUsuario}`);
        console.log(idUsuario)
        return response.data; 
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};