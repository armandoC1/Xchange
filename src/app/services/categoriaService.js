import axiosInstance from './axiosInstance';

export const obtenerTodasCategorias = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get('/categorias', {
            page,
            limit
        });
        if (!response.data) {
            alert('No hay ofertas disponibles')
        }
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
    console.log("id a eliminar ", id)
    try {
        const response = await axiosInstance.delete(`/categorias/delete/${id}`);
        return response.status == 200;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('Categoria no encontrada')
            return null;
        }
        console.error(`Error eliminando categoría con id ${id}:`, error);
        throw error;
    }
};

export const actualizarCategoria = async (categoria) => {
    try {
        const response = await axiosInstance.put(`/categorias/edit/${categoria.id}`, {
            nombre: categoria.nombre,
        });
        return response.status === 200;
    } catch (error) {
        console.error(`Error al actualizar la categoría con id ${categoria.id}:`, error);
        throw error;
    }
};

export const obtenerCategoriaPorId = async (idCategoria) => {
    try {
        const response = await axiosInstance.get(`/categorias/find/${idCategoria}`);
        console.log( "data: ",response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        throw error;
    }
};