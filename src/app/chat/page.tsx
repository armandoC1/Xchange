"use client";
import { useEffect, useState } from 'react';
import { getGroupedMessages } from '../services/chatService';
import { useRouter } from 'next/navigation';
import { obtenerUsuarioPorId } from '../services/usuarioService';

interface Message {
    id: number;
    contenidoMensaje: string;
    fechaEnvio: string;
    idRemitente: number;
    idDestinatario: number;
}

interface ChatPreview {
    id: number;
    lastMessage: string;
    lastMessageDate: string;
    userId: number;
    userName: string;
}

const ChatsPage = () => {
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('idUsuario');
        if (storedUserId) {
            const userIdNumber = parseInt(storedUserId);
            setUserId(userIdNumber);
            fetchChats(userIdNumber);
        } else {
            setError("No se puede cargar la lista de chats sin el ID de usuario.");
            setLoading(false);
        }
    }, []);

    const fetchChats = async (userId: number) => {
        setLoading(true);
        try {
            const data = await getGroupedMessages(userId);
            const chatPreviews = await Promise.all(
                Object.entries(data[userId] || {}).map(async ([otherUserId, messages]) => {
                    const messagesArray = messages as Message[];
                    if (messagesArray.length > 0) {
                        const lastMessage = messagesArray[messagesArray.length - 1];
                        try {
                            const userNameData = await obtenerUsuarioPorId(parseInt(otherUserId));
                            return {
                                id: lastMessage.id,
                                lastMessage: lastMessage.contenidoMensaje,
                                lastMessageDate: lastMessage.fechaEnvio,
                                userId: parseInt(otherUserId),
                                userName: userNameData.nombre || `Usuario ${otherUserId}`,
                            };
                        } catch {
                            return {
                                id: lastMessage.id,
                                lastMessage: lastMessage.contenidoMensaje,
                                lastMessageDate: lastMessage.fechaEnvio,
                                userId: parseInt(otherUserId),
                                userName: `Usuario ${otherUserId}`,
                            };
                        }
                    }
                    return null;
                })
            );

            setChatPreviews(chatPreviews.filter((chat): chat is ChatPreview => chat !== null));
        } catch (error) {
            console.error('Error al obtener la lista de chats:', error);
            setError('Hubo un error al cargar la lista de chats.');
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (chat: ChatPreview) => {
        sessionStorage.setItem('idDestinatario', chat.userId.toString());
        router.push(`/chat/${chat.userId}`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-50 p-5">
            <h1 className="text-3xl font-bold text-blue-800 mb-5">Lista de Chats</h1>
            {error && <p className="text-red-600">{error}</p>}

            {loading && (
                <div className="flex flex-col items-center mt-5">
                    <div className="animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10"></div>
                    <p className="text-blue-800 mt-2">Cargando chats...</p>
                </div>
            )}

            {!loading && (
                <div className="w-full max-w-lg mt-5 space-y-4">
                    {chatPreviews.length > 0 ? (
                        chatPreviews.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatClick(chat)}
                                className="cursor-pointer rounded-lg bg-white p-4 shadow-md border-l-4 border-blue-600 hover:bg-blue-100 transition"
                            >
                                <h2 className="text-blue-800 font-semibold">{chat.userName}</h2>
                                <p className="text-gray-700 mt-1">{chat.lastMessage}</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Fecha: {new Date(chat.lastMessageDate).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-center">No hay chats para mostrar.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatsPage;
