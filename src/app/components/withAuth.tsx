// components/withAuth.tsx
import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';

function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {

  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
}

export default withAuth;
