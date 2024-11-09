import axiosInstance from "./axiosInstance";

export const sendMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post('/mensajes/sendMenssage', {
            contenidoMensaje: messageData.contenidoMensaje,
            idOferta: messageData.idOferta,
            idRemitente: messageData.idRemitente,
            idDestinatario: messageData.idDestinatario
        });

        return response.data
    } catch (error) {
        console.log('Error al mandar mensaje: ', error)
        throw error
    }
}

export const chatMessage = async () => {
    try {
        const response = await axiosInstance.get('/mensajes/chat')
        return response.data
    } catch (error) {
        console.error('Error al obtener mensajes, desde servicio', error)
        throw error
    }
}
