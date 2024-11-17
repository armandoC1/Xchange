'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPorId } from '@/app/services/ofertasService';
import { obtenerUsuarioPorId } from '@/app/services/usuarioService';
import { obtenerCategoriaPorId } from '@/app/services/categoriaService';
import { getGroupedMessages, sendMessage } from '@/app/services/chatService';
import { ChevronLeft, ChevronRight, MessageCircle, MapPin, Tag, User, Package2, X, Send } from 'lucide-react';
import Swal from 'sweetalert2';

interface Oferta {
    idOferta: number;
    titulo: string;
    descripcion: string;
    condicion: string;
    ubicacion: string;
    imagenes: string[];
    idCategoria: number;
    idUsuario: number;
}

interface Message {
    id: number;
    contenidoMensaje: string;
    fechaEnvio: string;
    idRemitente: number;
    idDestinatario: number;
}

export default function OfertaDetallesPage() {
    const { id } = useParams();
    const [oferta, setOferta] = useState<Oferta | null>(null);
    const [usuarioNombre, setUsuarioNombre] = useState<string | null>(null);
    const [categoriaNombre, setCategoriaNombre] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para el scroll automático

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('idUsuario');
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }

        if (id) {
            fetchOferta();
        }
    }, [id]);

    useEffect(() => {
        // Desplaza el scroll automáticamente al final cada vez que se actualizan los mensajes
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchOferta = async () => {
        Swal.fire({
            title: 'Cargando...',
            html: 'Obteniendo detalles del producto',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const data = await obtenerPorId(id);
            sessionStorage.setItem('idOferta', data.idOferta);
            setOferta(data);

            if (data.idUsuario) {
                const usuario = await obtenerUsuarioPorId(data.idUsuario);
                sessionStorage.setItem('idDestinatario', data.idUsuario.toString());
                setUsuarioNombre(usuario.nombre);
            }
            if (data.idCategoria) {
                const categoria = await obtenerCategoriaPorId(data.idCategoria);
                setCategoriaNombre(categoria.nombre);
            }
            Swal.close();
        } catch (error) {
            console.error('Error al cargar la oferta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la oferta'
            });
        }
    };

    const nextImage = () => {
        if (!oferta || !oferta.imagenes || oferta.imagenes.length === 0) {
            return;
        }
        setCurrentImageIndex((prev) =>
            prev === oferta.imagenes.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? (oferta?.imagenes.length ?? 1) - 1 : prev - 1
        );
    };

    const handleOpenChat = async () => {
        if (userId && oferta) {
            try {
                const data = await getGroupedMessages(userId);
                const recipientMessages = data[userId]?.[oferta.idUsuario] || [];
                const userMessages = data[oferta.idUsuario]?.[userId] || [];
                const allMessages = [...recipientMessages, ...userMessages].sort(
                    (a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime()
                );
                setMessages(allMessages);
                setShowChat(true);
            } catch (error) {
                console.error('Error al cargar los mensajes:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los mensajes'
                });
            }
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !userId || !oferta) return;

        try {
            await sendMessage({
                contenidoMensaje: newMessage,
                idRemitente: userId,
                idDestinatario: oferta.idUsuario,
            });
            setNewMessage('');
            handleOpenChat(); // Refresh messages
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el mensaje'
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!oferta) return null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative">
                            {oferta.imagenes && oferta.imagenes.length > 0 && (
                                <div className="relative h-[500px]">
                                    <img
                                        src={`data:image/jpeg;base64,${oferta.imagenes[currentImageIndex]}`}
                                        alt={`Imagen de ${oferta.titulo}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {oferta.imagenes.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all transform hover:scale-110"
                                                aria-label="Imagen anterior"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all transform hover:scale-110"
                                                aria-label="Siguiente imagen"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                                {oferta.imagenes.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                            index === currentImageIndex
                                                                ? 'bg-white scale-125'
                                                                : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-6 md:p-8 lg:p-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                {oferta.titulo}
                            </h1>

                            <div className="space-y-6 mb-8">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h2 className="font-semibold text-gray-900 mb-3">Descripción</h2>
                                    <p className="text-gray-600 leading-relaxed">{oferta.descripcion}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <Package2 className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Condición</h3>
                                            <p className="text-gray-900 font-medium">{oferta.condicion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                                            <p className="text-gray-900 font-medium">{oferta.ubicacion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <Tag className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                                            <p className="text-gray-900 font-medium">
                                                {categoriaNombre || "Cargando categoría..."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                                        <User className="w-5 h-5 text-primary" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Publicado por</h3>
                                            <p className="text-gray-900 font-medium">
                                                {usuarioNombre || "Cargando usuario..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleOpenChat}
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span className="text-lg">Me interesa</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            {showChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex text-gray-600 justify-between items-center">
                            <h2 className="text-xl font-semibold">Chat con {usuarioNombre}</h2>
                            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
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
                                                : 'bg-gray-200 text-gray-900'
                                        }`}
                                    >
                                        <p>{message.contenidoMensaje}</p>
                                        <p className="text-xs mt-1 opacity-75">{formatDate(message.fechaEnvio)}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Referencia para el scroll automático */}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="border-t p-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 border rounded-full text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
