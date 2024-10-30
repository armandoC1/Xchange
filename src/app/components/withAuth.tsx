// components/withAuth.tsx
import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';

// Extendemos P de JSX.IntrinsicAttributes para incluir 'key' y 'ref'
function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  // Componente autenticado que recibe las props de tipo P
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      // Verificamos si el token existe en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Si no existe, redirigimos al usuario al login
        router.replace('/login');
      }
    }, [router]);

    // Renderizamos el componente envuelto con las props
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
}

export default withAuth;


