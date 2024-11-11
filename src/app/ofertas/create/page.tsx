'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { guardarOferta } from "@/app/services/ofertasService";
import { mostrarCategorias } from "@/app/services/categoriaService";
import { obtenerUsuarioPorId } from "@/app/services/usuarioService";
import Swal from 'sweetalert2';

interface Categoria {
  id: number;
  nombre: string;
}

export default function CrearOferta() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ofertaData, setOfertaData] = useState({
    titulo: "",
    descripcion: "",
    condicion: "",
    ubicacion: "",
    imagenes: [] as File[],
    idCategoria: "",
  });
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await mostrarCategorias();
        setCategorias(response);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías',
          confirmButtonColor: '#3B82F6'
        });
      }
    };

    const fetchUsuario = async () => {
      try {
        const idUsuario = sessionStorage.getItem('idUsuario');
        if (idUsuario) {
          const user = await obtenerUsuarioPorId(Number(idUsuario));
          setUserId(user.idUsuario);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información del usuario',
          confirmButtonColor: '#3B82F6'
        });
      }
    };

    fetchCategorias();
    fetchUsuario();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOfertaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setOfertaData((prevData) => ({
      ...prevData,
      imagenes: files,
    }));

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await guardarOferta({
        ...ofertaData,
        idUsuario: userId,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Oferta creada exitosamente',
        confirmButtonColor: '#3B82F6'
      });
      router.push("/ofertas");
    } catch (error) {
      console.error("Error al crear la oferta:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la oferta',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
              Crear Nueva Oferta
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 flex justify-center items-center">
                <div className="bg-gray-100 rounded-lg p-4 w-full flex flex-col justify-center items-center">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-500"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-700">
                        No hay imágenes seleccionadas
                      </p>
                    </div>
                  )}
                  <label
                    htmlFor="file-upload"
                    className="mt-4 cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Seleccionar imágenes
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="md:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-black">
                      Título
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      id="titulo"
                      value={ofertaData.titulo}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-black">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      id="descripcion"
                      value={ofertaData.descripcion}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="condicion" className="block text-sm font-medium text-gray-900">
                      Condición
                    </label>
                    <input
                      type="text"
                      name="condicion"
                      id="condicion"
                      value={ofertaData.condicion}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-900">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      name="ubicacion"
                      id="ubicacion"
                      value={ofertaData.ubicacion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="idCategoria" className="block text-sm font-medium text-gray-900">
                      Categoría
                    </label>
                    <select
                      name="idCategoria"
                      id="idCategoria"
                      value={ofertaData.idCategoria}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias?.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creando...
                        </>
                      ) : (
                        'Crear Oferta'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
