// pages/registro.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  nombre_usuario: string;
  correo_electronico: string;
  contrasena: string;
  numero_telefono: string;
  ubicacion: string;
}

export default function Registro() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre_usuario: '',
    correo_electronico: '',
    contrasena: '',
    numero_telefono: '',
    ubicacion: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Registro exitoso. Redirigiendo al inicio de sesión.');
        router.push('/login');
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre_usuario"
        type="text"
        placeholder="Nombre de usuario"
        value={formData.nombre_usuario}
        onChange={handleChange}
        required
      />
      <input
        name="correo_electronico"
        type="email"
        placeholder="Correo electrónico"
        value={formData.correo_electronico}
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
        name="numero_telefono"
        type="text"
        placeholder="Número de teléfono"
        value={formData.numero_telefono}
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
      <button type="submit">Registrarse</button>
    </form>
  );
}
