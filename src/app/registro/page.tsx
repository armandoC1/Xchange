// pages/registro.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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
      const res = await fetch('http://localhost:8080/usuarios/registro', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        alert('Registro exitoso. Redirigiendo al inicio de sesión.');
        router.push('/login');
      } else {
        const errorData = await res.text();
        alert(`Error: ${errorData}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        type="text"
        placeholder="Nombre de usuario"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        value={formData.correo}
        onChange={handleChange}
        required
      />
      <input
        name="contrasena"
        type="password"
        placeholder="Contraseña"
        value={formData.contrasena}
        onChange={handleChange}
        required
      />
      <input
        name="numeroTelefono"
        type="text"
        placeholder="Número de teléfono"
        value={formData.numeroTelefono}
        onChange={handleChange}
        required
      />
      <input
        name="ubicacion"
        type="text"
        placeholder="Ubicación"
        value={formData.ubicacion}
        onChange={handleChange}
        required
      />
      <select
        name="idRol"
        value={formData.idRol}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un rol</option>
        <option value="1">Usuario</option>
        <option value="2">Administrador</option>
      </select>
      <input type="file" name="fotoPerfil" onChange={handleFileChange} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
