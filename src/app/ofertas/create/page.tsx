'use client';

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
  condicion: string;
  ubicacion: string;
  idCategoria: number;
  imagenes: string[];
}

const condicionesValidas = ['Nuevo', 'Usado', 'Buena condición', 'Reparado', 'Defectuoso'];

export default function CrearOferta() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    condicion: '',
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
        const res = await fetch('http://api.xchangesv.es:8080/categorias/list', { // aqui hay uno
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener las categorías');
        }

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews: string[] = [];
    const base64Promises: Promise<string>[] = [];

    files.forEach((file) => {
      previews.push(URL.createObjectURL(file));

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          }
        };
        reader.onerror = () => {
          reject('Error al convertir la imagen a Base64');
        };
        reader.readAsDataURL(file);
      });
      base64Promises.push(base64Promise);
    });

    setImagePreviews(previews);

    try {
      const base64Images = await Promise.all(base64Promises);
      setFormData({ ...formData, imagenes: base64Images });
    } catch (error) {
      console.error('Error al procesar las imágenes en Base64:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem('token');
    const idUsuario = sessionStorage.getItem('idUsuario');

    if (!token || !idUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'No se encontró un token o ID de usuario válido. Por favor, inicia sesión de nuevo.',
      });
      setLoading(false);
      return;
    }

    if (!formData.titulo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El título no puede estar vacío.',
      });
      setLoading(false);
      return;
    }

    if (formData.titulo.length > 100) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El título no puede tener más de 100 caracteres.',
      });
      setLoading(false);
      return;
    }

    if (!formData.descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La descripción no puede estar vacía.',
      });
      setLoading(false);
      return;
    }

    if (formData.descripcion.length > 500) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La descripción no puede tener más de 500 caracteres.',
      });
      setLoading(false);
      return;
    }

    if (!condicionesValidas.includes(formData.condicion)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `La condición debe ser una de las siguientes: ${condicionesValidas.join(', ')}.`,
      });
      setLoading(false);
      return;
    }

    if (!formData.ubicacion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La ubicación no puede estar vacía.',
      });
      setLoading(false);
      return;
    }

    if (formData.idCategoria === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar una categoría válida.',
      });
      setLoading(false);
      return;
    }

    if (formData.imagenes.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe agregar al menos una imagen antes de enviar la oferta.',
      });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    const ofertaData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      condicion: formData.condicion,
      ubicacion: formData.ubicacion,
      idCategoria: formData.idCategoria,
      idUsuario: parseInt(idUsuario),
    };

    formDataToSend.append(
      'oferta',
      new Blob([JSON.stringify(ofertaData)], { type: 'application/json' })
    );

    formData.imagenes.forEach((base64Image, index) => {
      const byteString = atob(base64Image.split(',')[1]);
      const mimeType = base64Image.split(',')[0].match(/:(.*?);/)![1];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeType });
      formDataToSend.append('imagenes', blob, `imagen${index + 1}.${mimeType.split('/')[1]}`);
    });

    try {
      const res = await fetch('http://api.xchangesv.es:8080/ofertas/save', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (res.ok) {
        const responseData = await res.json();
        Swal.fire({
          icon: 'success',
          title: '¡Oferta creada exitosamente!',
          text: 'Tu oferta ha sido publicada.',
        });
        router.push('/ofertas');
      } else {
        const errorData = await res.text();
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la oferta',
          text: errorData || 'Ocurrió un error inesperado.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al enviar la oferta. Inténtalo nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-purple-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Oferta</h2>
          <p className="text-gray-600">Completa el formulario para publicar tu oferta</p>
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
                  placeholder="Título de la oferta"
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
                  placeholder="Descripción de la oferta"
                />
              </div>

              <div className="relative">
                <label htmlFor="condicion" className="block text-sm font-medium text-gray-700 mb-1">
                  Condición
                </label>
                <select
                  id="condicion"
                  name="condicion"
                  required
                  value={formData.condicion}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                >
                  <option value="">Seleccione una condición</option>
                  {condicionesValidas.map((condicion) => (
                    <option key={condicion} value={condicion}>
                      {condicion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
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
            </div>
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Enviando...' : 'Crear Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
