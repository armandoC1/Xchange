"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface Categoria {
    id: number;
    nombre: string;
}

interface FormData {
    titulo: string;
    descripcion: string;
    ubicacion: string;
    idCategoria: number;
    imagenes: File[];
}

export default function CrearSolicitud() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        idCategoria: 0,
        imagenes: [],
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) throw new Error('Token no encontrado');

                const res = await fetch('http://api.xchangesv.es/categorias/list', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Error al obtener las categorías');

                const data = await res.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las categorías. Inténtalo nuevamente.',
                });
            }
        };

        fetchCategorias();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'idCategoria' ? parseInt(value) : value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const previews: string[] = files.map((file) => URL.createObjectURL(file));

        setImagePreviews(previews);
        setFormData({ ...formData, imagenes: files });
    };

    const enviarMensaje = async (contenido: string, idRemitente: number, idDestinatario: number) => {
        try {
            const token = sessionStorage.getItem('token');
            const mensajeData = {
                contenidoMensaje: contenido,
                idRemitente,
                idDestinatario,
            };

            const res = await fetch('http://api.xchangesv.es/mensajes/sendMenssage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(mensajeData),
            });

            if (!res.ok) {
                console.error('Error al enviar el mensaje:', await res.text());
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = sessionStorage.getItem('token');
        const idSolicitante = sessionStorage.getItem('idSolicitante');
        const idDestinatario = sessionStorage.getItem('idDestinatario');

        if (!token || !idSolicitante || !idDestinatario) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'No se encontraron datos de sesión válidos. Por favor, inicia sesión de nuevo.',
            });
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        const solicitudData = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            ubicacion: formData.ubicacion,
            idCategoria: formData.idCategoria,
            idSolicitante: parseInt(idSolicitante),
            idDestinatario: parseInt(idDestinatario),
        };

        formDataToSend.append(
            'solicitud',
            new Blob([JSON.stringify(solicitudData)], { type: 'application/json' })
        );

        formData.imagenes.forEach((imagen) => {
            formDataToSend.append('imagenes', imagen, imagen.name);
        });

        try {
            const res = await fetch('https://xchange-api-production.up.railway.app/solicitudes/save', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud creada exitosamente!',
                    text: 'Tu solicitud ha sido enviada.',
                });

                // Enviar mensajes
                await enviarMensaje('Solicitud enviada', parseInt(idSolicitante), parseInt(idDestinatario));
                await enviarMensaje('Solicitud recibida', parseInt(idDestinatario), parseInt(idSolicitante));

                // Redirigir al chat
                router.push(`/chat?user=${idDestinatario}`);
            } else {
                const errorData = await res.text();
                console.error('Error del servidor:', errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear la solicitud',
                    text: errorData || 'Ocurrió un error inesperado.',
                });
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al enviar la solicitud. Inténtalo nuevamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-purple-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Solicitud</h2>
                    <p className="text-gray-600">Completa el formulario para enviar tu solicitud</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="relative">
                                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    type="text"
                                    required
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                                    placeholder="Título de la solicitud"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    required
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                                    placeholder="Descripción de la solicitud"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ubicación
                                </label>
                                <input
                                    id="ubicacion"
                                    name="ubicacion"
                                    type="text"
                                    required
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                                    placeholder="Ubicación"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <label htmlFor="idCategoria" className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría
                                </label>
                                <select
                                    id="idCategoria"
                                    name="idCategoria"
                                    required
                                    value={formData.idCategoria}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Imágenes</label>
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="imagenes"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {imagePreviews.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <img
                                                            key={index}
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-20 w-20 object-cover rounded-lg"
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-gray-500">Arrastra o selecciona tus imágenes</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="imagenes"
                                            name="imagenes"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Enviando...' : 'Crear Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
