"use client";
import { useEffect, useState } from 'react';
import {sendMessage} from '../services/chatService'

const MessagePage = () => {
    const [contenidoMensaje, setContenidoMensaje] = useState('');
    const [idOferta, setIdOferta] = useState<string | null>(null);
    const [idRemitente, setIdRemitente] = useState<string | null>(null);
    const [idDestinatario, setIdDestinatario] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Carga los datos desde sessionStorage al montar el componente
        const storedIdOferta = sessionStorage.getItem('idOferta');
        const storedIdRemitente = sessionStorage.getItem('idUsuario');
        const storedIdDestinatario = sessionStorage.getItem('idDestinatario');

        setIdOferta(storedIdOferta);
        setIdRemitente(storedIdRemitente);
        setIdDestinatario(storedIdDestinatario);

        // Imprime los IDs en consola
        console.log('ID Oferta:', storedIdOferta);
        console.log('ID Remitente:', storedIdRemitente);
        console.log('ID Destinatario:', storedIdDestinatario);
    }, []);

    const handleSendMessage = async () => {
        if (!contenidoMensaje || !idOferta || !idRemitente || !idDestinatario) {
            setError('Todos los campos son necesarios');
            return;
        }
        try {
            const messageData = {
                contenidoMensaje,
                idOferta: parseInt(idOferta),
                idRemitente: parseInt(idRemitente),
                idDestinatario: parseInt(idDestinatario)
            };
            console.log('cuerpo del mensaje: ', messageData)
            await sendMessage(messageData);
            setContenidoMensaje(''); // Limpia el campo después de enviar

        } catch (err) {
            console.error('Error al mandar mensaje:', err);
            setError('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
        }
    };

    return (
        <div>
            <h1>Enviar Mensaje</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <textarea
                value={contenidoMensaje}
                onChange={(e) => setContenidoMensaje(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
};

export default MessagePage;
