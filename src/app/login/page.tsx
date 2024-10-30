// app/login/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Credentials = {
  correo: string;
  contrasena: string;
}

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({
    correo: '',
    contrasena: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Datos que se enviarán:', credentials)
    try {
      const res = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Estado de la respuesta:', res.status, res.statusText);
      const contentType = res.headers.get('Content-Type');
      console.log('Content-Type de la respuesta:', contentType);

      const responseText = await res.text();
      console.log('Cuerpo de la respuesta:', responseText);

      if (res.ok) {
        try {
          const data = JSON.parse(responseText);
          sessionStorage.setItem('token', data.token);
          alert('Inicio de sesión exitoso.');
          router.push('/');
        } catch (parseError) {
          console.error('Error al parsear JSON:', parseError);
          alert('Error al procesar la respuesta del servidor.');
        }
      } else {
        console.error(`Error ${res.status}: ${res.statusText}`);
        alert(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        value={credentials.correo}
        onChange={handleChange}
        required
      />
      <input
        name="contrasena"
        type="password"
        placeholder="Contraseña"
        value={credentials.contrasena}
        onChange={handleChange}
        required
      />
      <button type="submit">Iniciar Sesión</button>
      <a href="/registro">Aun no tienes cuenta? Registrate</a>
    </form>
  );
}
