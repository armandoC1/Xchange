"use client";
import { useEffect, useState } from 'react';
import { sendMessage, getGroupedMessages } from '../../services/chatService';
import { obtenerUsuarioPorId } from '../../services/usuarioService';

interface Message {
    id: number;
    contenidoMensaje: string;
    fechaEnvio: string;
    idRemitente: number;
    idDestinatario: number;
}

const MessagePage = () => {
    const [contenidoMensaje, setContenidoMensaje] = useState<string>('');
    const [userId, setUserId] = useState<number | null>(null);
    const [recipientId, setRecipientId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('idUsuario');
        const storedRecipientId = sessionStorage.getItem('idDestinatario');

        if (storedUserId && storedRecipientId) {
            const userIdNumber = parseInt(storedUserId);
            const recipientIdNumber = parseInt(storedRecipientId);

            if (userIdNumber === recipientIdNumber) {
                setError("Error: El usuario y el destinatario no pueden ser el mismo.");
                return;
            }

            setUserId(userIdNumber);
            setRecipientId(recipientIdNumber);
            fetchConversations(userIdNumber);
            fetchMessages(userIdNumber, recipientIdNumber);
        } else {
            setError("No se pueden cargar los mensajes sin los IDs de usuario y destinatario.");
        }
    }, []);

    useEffect(() => {
        if (userId && recipientId) {
            const intervalId = setInterval(async () => {
                try {
                    const data = await getGroupedMessages(userId) as Record<string, Record<string, Message[]>>;
                    const userToRecipientMessages = data[userId]?.[recipientId] || [];
                    const recipientToUserMessages = data[recipientId]?.[userId] || [];

                    const newMessages = [...userToRecipientMessages, ...recipientToUserMessages]
                        .sort((a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime());

                    if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                        setMessages(newMessages);
                    }
                } catch (error) {
                    console.error("Error al actualizar los mensajes:", error);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [userId, recipientId, messages]);

    const fetchConversations = async (userId: number) => {
        try {
            const data = await getGroupedMessages(userId) as Record<string, Record<string, Message[]>>;
            const uniqueRecipients = new Set<number>();

            Object.keys(data).forEach((senderId) => {
                Object.keys(data[senderId]).forEach((recipientId) => {
                    const senderIdNum = parseInt(senderId);
                    const recipientIdNum = parseInt(recipientId);

                    if (senderIdNum === userId) {
                        uniqueRecipients.add(recipientIdNum);
                    } else if (recipientIdNum === userId) {
                        uniqueRecipients.add(senderIdNum);
                    }
                });
            });

            const conversationsWithNames = await Promise.all(
                Array.from(uniqueRecipients).map(async (id) => {
                    const userData = await obtenerUsuarioPorId(id);
                    return { id, name: userData.nombre || `Usuario ${id}` };
                })
            );

            setConversations(conversationsWithNames);
        } catch (error) {
            console.error("Error al obtener las conversaciones:", error);
            setError("Hubo un error al cargar las conversaciones.");
        }
    };

    const fetchMessages = async (userId: number, recipientId: number) => {
        try {
            const data = await getGroupedMessages(userId) as Record<string, Record<string, Message[]>>;

            const userToRecipientMessages = data[userId]?.[recipientId] || [];
            const recipientToUserMessages = data[recipientId]?.[userId] || [];

            const allMessages = [...userToRecipientMessages, ...recipientToUserMessages]
                .sort((a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime());

            setMessages(allMessages);
        } catch (error) {
            console.error('Error al obtener mensajes agrupados:', error);
            setError('Hubo un error al cargar los mensajes.');
        }
    };

    const handleSendMessage = async () => {
        if (!contenidoMensaje || !userId || recipientId === null) {
            setError(`Todos los campos son necesarios. Mensaje: ${contenidoMensaje}, userId: ${userId}, recipientId: ${recipientId}`);
            return;
        }

        const messageData = {
            contenidoMensaje,
            idRemitente: userId,
            idDestinatario: recipientId
        };

        try {
            await sendMessage(messageData);
            setContenidoMensaje('');
            fetchMessages(userId, recipientId);
        } catch (err) {
            console.error('Error al mandar mensaje:', err);
            setError('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
        }
    };

    const handleSelectConversation = (selectedRecipientId: number) => {
        if (selectedRecipientId !== recipientId) {
            setRecipientId(selectedRecipientId);
            setMessages([]);
            if (userId) {
                fetchMessages(userId, selectedRecipientId);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-50 p-5">
            <h1 className="text-3xl font-bold text-blue-800 mb-5">Mensajes</h1>
            {error && <p className="text-red-600">{error}</p>}

            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 mb-5">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">Conversación</h2>

                <div className="flex flex-col mb-3">
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => handleSelectConversation(conversation.id)}
                            className={`p-2 rounded-lg ${recipientId === conversation.id ? 'bg-blue-300' : 'bg-blue-100'
                                } mb-2 text-blue-800`}
                        >
                            Conversación con {conversation.name}
                        </button>
                    ))}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-3">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-3 rounded-lg shadow-md ${message.idRemitente === userId
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
                    Enviar mensaje
                </button>
            </div>
        </div>
    );
};

export default MessagePage;
