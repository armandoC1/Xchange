import axiosInstance from './axiosInstance';

export const obtenerTodasCategorias = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get('/categorias/listPage', {
            params: {
                page: page - 1,
                size: limit
            }
        });
        if (!response.data) {
            alert('No hay ofertas disponibles');
        }
        return response.data;
    } catch (error) {
        console.error("Error obteniendo todas las categorías:", error);
        throw error;
    }
};

export const mostrarCategorias = async () => {
    try {
        const response = await axiosInstance.get('/categorias/list')
        return response.data
    } catch (error) {
        console.error('Error al obtener categorias ', error)
        throw error
    }
}

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

//funciona
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

//funciona
export const obtenerCategoriaPorId = async (idCategoria) => {
    try {
        const response = await axiosInstance.get(`/categorias/findById/${idCategoria}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        throw error;
    }
};