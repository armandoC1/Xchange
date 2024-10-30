// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesion para acceder')
      router.replace('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Bienvenido a la página de inicio</h1>
      {/* Aquí puedes agregar más contenido o componentes */}
    </div>
  );
}
