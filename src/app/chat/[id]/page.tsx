"use client";
import { useEffect, useState } from 'react';
import { sendMessage, getGroupedMessages } from '../../services/chatService';

interface Message {
    id: number;
    contenidoMensaje: string;
    fechaEnvio: string;
    idRemitente: number;
    idDestinatario: number;
}

const MessagePage = () => {
    const [contenidoMensaje, setContenidoMensaje] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [recipientId, setRecipientId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('idUsuario');
        
        if (storedUserId) {
            setUserId(storedUserId);
            fetchMessages(storedUserId);

            const intervalId = setInterval(() => {
                fetchMessages(storedUserId);
            }, 1000);

            return () => clearInterval(intervalId);
        } else {
            setError("No se pueden cargar los mensajes sin el ID de usuario.");
        }
    }, []);

    const fetchMessages = async (usuarioId: string) => {
        try {
            const data = await getGroupedMessages(parseInt(usuarioId)) as Record<string, Record<string, Message[]>>;
            const unifiedMessages: Message[] = Object.values(data)
                .flatMap((group) => Object.values(group).flat())
                .sort((a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime());

            setMessages(unifiedMessages);

            if (unifiedMessages.length > 0) {
                const lastMessage = unifiedMessages[unifiedMessages.length - 1];
                setRecipientId(
                    lastMessage.idRemitente === parseInt(usuarioId) 
                        ? lastMessage.idDestinatario 
                        : lastMessage.idRemitente
                );
            } else {
                const storedRecipientId = sessionStorage.getItem('idDestinatario');
                if (storedRecipientId) {
                    setRecipientId(parseInt(storedRecipientId));
                } else {
                    setError('No se encontró el destinatario.');
                }
            }
        } catch (error) {
            console.error('Error al obtener mensajes agrupados:', error);
            setError('Hubo un error al cargar los mensajes.');
        }
    };

    const handleSendMessage = async () => {
        if (!contenidoMensaje || !userId || recipientId === null) {
            setError(`Todos los campos son necesarios ${contenidoMensaje} ${userId} ${recipientId}`);
            return;
        }

        const messageData = {
            contenidoMensaje,
            idRemitente: parseInt(userId),
            idDestinatario: recipientId
        };

        try {
            await sendMessage(messageData);
            setContenidoMensaje('');
            fetchMessages(userId);
        } catch (err) {
            console.error('Error al mandar mensaje:', err);
            setError('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-50 p-5">
            <h1 className="text-3xl font-bold text-blue-800 mb-5">Mensajes</h1>
            {error && <p className="text-red-600">{error}</p>}

            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 mb-5">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">Conversación</h2>
                <div className="max-h-80 overflow-y-auto space-y-3">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`p-3 rounded-lg shadow-md ${
                                    message.idRemitente === parseInt(userId || '0') 
                                        ? 'bg-blue-200 text-right animate-fade-in-right' 
                                        : 'bg-gray-200 text-left animate-fade-in-left'
                                }`}
                            >
                                <p className="font-semibold">{message.contenidoMensaje}</p>
                                <p className="text-sm text-gray-600">{new Date(message.fechaEnvio).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-center">No hay mensajes para mostrar.</p>
                    )}
                </div>
            </div>

            <div className="w-full max-w-lg flex items-center space-x-3">
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                    value={contenidoMensaje}
                    onChange={(e) => setContenidoMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                />
                <button 
                    onClick={handleSendMessage} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform active:scale-95"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default MessagePage;
