"use client";

import { useEffect, useState, useRef } from 'react';
import { getGroupedMessages, sendMessage } from '../services/chatService';
import { obtenerUsuarioPorId } from '../services/usuarioService';
import { MessageCircle, Send } from 'lucide-react';

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

export default function ChatLayout() {
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [contenidoMensaje, setContenidoMensaje] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false); // Added isSending state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('idUsuario');
        if (storedUserId) {
            const userIdNumber = parseInt(storedUserId);
            setUserId(userIdNumber);
            fetchChats(userIdNumber);
        } else {
            setError("No se puede cargar sin el ID de usuario.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedChat && userId) {
            fetchMessages(userId, selectedChat.userId);
            const intervalId = setInterval(() => {
                fetchMessages(userId, selectedChat.userId);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [selectedChat, userId]);

    useEffect(() => {
        if (messages.length > 0) {
            const shouldScroll = messagesEndRef.current?.scrollHeight === messagesEndRef.current?.clientHeight ||
                messagesEndRef.current?.scrollTop + messagesEndRef.current?.clientHeight >= messagesEndRef.current?.scrollHeight - 100;

            if (shouldScroll) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages]);

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
            console.error('Error al obtener chats:', error);
            setError('Error al cargar los chats.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: number, recipientId: number) => {
        try {
            const data = await getGroupedMessages(userId);
            const userToRecipientMessages = data[userId]?.[recipientId] || [];
            const recipientToUserMessages = data[recipientId]?.[userId] || [];

            const allMessages = [...userToRecipientMessages, ...recipientToUserMessages]
                .sort((a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime());

            // Only update if messages have changed
            if (JSON.stringify(allMessages) !== JSON.stringify(messages)) {
                setMessages(allMessages);
            }
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contenidoMensaje.trim() || !userId || !selectedChat || isSending) return;

        setIsSending(true);
        const messageData = {
            contenidoMensaje,
            idRemitente: userId,
            idDestinatario: selectedChat.userId
        };

        try {
            await sendMessage(messageData);
            setContenidoMensaje('');
            await fetchMessages(userId, selectedChat.userId);
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            setError('Error al enviar el mensaje.');
        } finally {
            setIsSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Ayer';
        } else if (days < 7) {
            return date.toLocaleDateString('es-ES', { weekday: 'long' });
        } else {
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Lista de chats */}
            <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800">Mensajes</h1>
                    {error && (
                        <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded">
                            {error}
                        </div>
                    )}
                </div>

                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : chatPreviews.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {chatPreviews.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                        selectedChat?.userId === chat.userId ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {chat.userName.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-semibold text-gray-900 truncate">
                                                {chat.userName}
                                            </h2>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(chat.lastMessageDate)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 truncate">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 text-center">No hay conversaciones aún</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="hidden md:flex flex-1 flex-col bg-gray-50">
                {selectedChat ? (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {selectedChat.userName.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="ml-3 text-lg font-semibold text-gray-900">
                                    {selectedChat.userName}
                                </h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.idRemitente === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                            message.idRemitente === userId
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-900'
                                        }`}
                                    >
                                        <p className="break-words">{message.contenidoMensaje}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.idRemitente === userId
                                                ? 'text-blue-100'
                                                : 'text-gray-500'
                                        }`}>
                                            {formatDate(message.fechaEnvio)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={contenidoMensaje}
                                    onChange={(e) => setContenidoMensaje(e.target.value)}
                                    placeholder={isSending ? "Enviando mensaje..." : "Escribe un mensaje..."}
                                    disabled={isSending}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!contenidoMensaje.trim() || isSending}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className={`h-5 w-5 ${isSending ? 'animate-pulse' : ''}`} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <MessageCircle className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">Tus mensajes</h3>
                        <p className="mt-2 text-gray-500">Selecciona una conversación para ver los mensajes</p>
                    </div>
                )}
            </div>
        </div>
    );
}