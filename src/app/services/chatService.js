import axiosInstance from "./axiosInstance";

export const sendMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post('/mensajes/sendMenssage', {
            contenidoMensaje: messageData.contenidoMensaje,
            idRemitente: messageData.idRemitente,
            idDestinatario: messageData.idDestinatario
        });

        return response.data
    } catch (error) {
        console.log('Error al mandar mensaje: ', error)
        throw error
    }
}

export const getGroupedMessages = async (userId) => {
    try {
        const response = await axiosInstance.get('/mensajes/chat', {
            params: {
                userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener mensajes agrupados:', error);
        throw error;
    }
};
