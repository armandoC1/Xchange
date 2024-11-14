'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, MapPin, Upload, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface FormData {
  nombre: string;
  correo: string;
  contrasena: string;
  numeroTelefono: string;
  ubicacion: string;
  idRol: number;
  fotoPerfil: File | null;
}

export default function Registro() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    correo: '',
    contrasena: '',
    numeroTelefono: '',
    ubicacion: '',
    idRol: 1,
    fotoPerfil: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idRol' ? parseInt(value) : value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, fotoPerfil: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    const usuarioData = {
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contrasena,
      numeroTelefono: formData.numeroTelefono,
      ubicacion: formData.ubicacion,
      idRol: formData.idRol,
    };

    formDataToSend.append('usuario', new Blob([JSON.stringify(usuarioData)], { type: 'application/json' }));

    if (formData.fotoPerfil) {
      formDataToSend.append('fotoPerfil', formData.fotoPerfil);
    }

    try {
      const res = await fetch('http://3.137.192.224:8080/usuarios/registro', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        // Mostrar alerta de "Redirigiendo..."
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Redirigiendo al inicio de sesión...',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000, // Duración de la alerta en milisegundos
          willClose: () => {
            router.push('/login');
          },
        });
      } else {
        const errorData = await res.text();
        Swal.fire({
          title: 'Error',
          text: `Error: ${errorData}`,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al registrar. Por favor, inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-purple-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Completa el formulario para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                    placeholder="tu@ejemplo.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="contrasena"
                    name="contrasena"
                    type="password"
                    required
                    value={formData.contrasena}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="numeroTelefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="numeroTelefono"
                    name="numeroTelefono"
                    type="text"
                    required
                    value={formData.numeroTelefono}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="ubicacion"
                    name="ubicacion"
                    type="text"
                    required
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                    placeholder="Tu ubicación"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="idRol" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="idRol"
                    name="idRol"
                    required
                    value={formData.idRol}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="1">Usuario</option>
                    <option value="2">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Foto de perfil</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="fotoPerfil"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-full" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Haz clic para subir tu foto</p>
                    </>
                  )}
                </div>
                <input id="fotoPerfil" name="fotoPerfil" type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Registrarse
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-indigo-600 transition-colors"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>

  )
}