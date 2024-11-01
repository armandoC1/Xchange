"use client";
import FormularioCategoria from '@/app/components/FormularioCategoria';
import { useRouter } from 'next/navigation';

const CrearCategoria = () => {
    const router = useRouter();

    const handleCategoriaCreada = () => {
        alert("Categoría creada exitosamente");
        router.push('/categorias');
    };

    return (
        <div>
            <h1>Crear Nueva Categoría</h1>
            <FormularioCategoria onCategoriaCreada={handleCategoriaCreada} />
        </div>
    );
};

export default CrearCategoria;
