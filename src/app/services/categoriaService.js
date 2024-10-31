import axiosInstance from './axiosInstance';

export const obtenerTodasCategorias = async () => {
    try {
        const response = await axiosInstance.get('/categorias/lista');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo todas las categorías:", error);
        throw error;
    }
};

export const crearCategoria = async (categoria) => {
    try {
        const response = await axiosInstance.post('/categorias/save', categoria);
        return response.data;
    } catch (error) {
        console.error("Error creando categoría:", error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const response = await axiosInstance.delete(`/categorias/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error eliminando categoría con id ${id}:`, error);
        throw error;
    }
};

export const obtenerCategoriaPorId = async (idCategoria) => {
    try {
        const response = await axiosInstance.get(`/categorias/find/${idCategoria}`);
        return response.data; // Debería incluir el nombre de la categoría
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        throw error;
    }
};