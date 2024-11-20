"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, ChevronLeft, User } from "lucide-react";
import { getGroupedMessages, sendMessage } from "@/app/services/chatService";
import { obtenerUsuarioPorId } from "@/app/services/usuarioService";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  contenidoMensaje: string;
  fechaEnvio: string;
  idRemitente: number;
  idDestinatario: number;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSolicitante, setIsSolicitante] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("idUsuario");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      setError("No se puede cargar sin el ID de usuario.");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConversations(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (selectedConversation && userId) {
      fetchMessages(userId, selectedConversation.id);
      const intervalId = setInterval(() => {
        fetchMessages(userId, selectedConversation.id);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [selectedConversation, userId]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && shouldScrollRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchConversations = async (userId: number) => {
    try {
      const data = await getGroupedMessages(userId);
      const conversationsData: Conversation[] = [];

      for (const [recipientId, messages] of Object.entries(data[userId] || {})) {
        if (Array.isArray(messages)) {
          const lastMessage = messages[messages.length - 1];
          const userData = await obtenerUsuarioPorId(parseInt(recipientId));
          conversationsData.push({
            id: parseInt(recipientId),
            name: userData?.nombre || `Usuario ${recipientId}`,
            lastMessage: lastMessage?.contenidoMensaje || "Mensaje no disponible",
            lastMessageDate: lastMessage?.fechaEnvio || null,
          });
        }
      }

      setConversations(conversationsData);
    } catch (error) {
      console.error("Error al obtener conversaciones:", error);
      setError("Error al cargar las conversaciones.");
    }
  };

  const fetchMessages = async (userId: number, recipientId: number) => {
    try {
      const data = await getGroupedMessages(userId);
      const userToRecipientMessages = data[userId]?.[recipientId] || [];
      const recipientToUserMessages = data[recipientId]?.[userId] || [];

      const allMessages = [...userToRecipientMessages, ...recipientToUserMessages].sort(
        (a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime()
      );

      setMessages(allMessages);

      if (allMessages.length > 0) {
        determineAndStoreParticipants(allMessages);
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      setError("Error al cargar los mensajes.");
    }
  };

  const determineAndStoreParticipants = (messages: Message[]) => {
    if (messages.length === 0) return;

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime()
    );

    const firstMessage = sortedMessages[0];
    const idSolicitante = firstMessage.idRemitente;
    const idDestinatario = firstMessage.idDestinatario;
    
    sessionStorage.setItem("idSolicitante", idSolicitante.toString())
    sessionStorage.setItem("idDestinatario", idDestinatario.toString())

    setIsSolicitante(userId === idSolicitante);

    console.log(
      `Participantes almacenados: Solicitante(${idSolicitante}), Destinatario(${idDestinatario})`
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !selectedConversation) return;

    try {
      shouldScrollRef.current = true;
      await sendMessage({
        contenidoMensaje: newMessage,
        idRemitente: userId,
        idDestinatario: selectedConversation.id,
      });
      setNewMessage("");
      fetchMessages(userId, selectedConversation.id);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setError("Error al enviar el mensaje.");
    }
  };

  const handleScroll = () => {
    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current.parentElement!;
      shouldScrollRef.current = scrollTop + clientHeight >= scrollHeight - 50;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div
        className={`bg-white w-full md:w-1/3 lg:w-1/4 border-r ${
          isMobileView && selectedConversation ? "hidden" : "block"
        }`}
      >
        <div className="p-4 border-b">
          <h1 className="text-2xl text-blue-400 font-semibold">Mensajes</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4  text-gray-400 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conv.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{conv.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(conv.lastMessageDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div
        className={`flex-1 flex flex-col ${
          isMobileView && !selectedConversation ? "hidden" : "block"
        }`}
      >
        {selectedConversation ? (
          <>
            <div className="bg-white p-4 border-b flex items-center">
              {isMobileView && (
                <button 
                  className="mr-4"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft size={24} color="black" />
                </button>
              )}
              <h2 className="text-xl  text-blue-400 font-semibold">{selectedConversation.name}</h2>
              {isSolicitante && (
                // boton para mandar a crear solicitud
                <button
                  onClick={() => router.push(`/solicitudes/crear`)}
                  className="ml-auto bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600"
                >
                  Mandar Solicitud
                </button>
              )}
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              onScroll={handleScroll}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.idRemitente === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${message.idRemitente === userId
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900"
                      }`}
                  >
                    <p>{message.contenidoMensaje}</p>
                    <p className="text-xs mt-1 opacity-75">{formatDate(message.fechaEnvio)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border text-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
