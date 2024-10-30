import { useState } from 'react';
import { crearCategoria } from '../services/categoriaService';

interface FormularioCategoriaProps {
    onCategoriaCreada: (categoria: any) => void;
}

const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({ onCategoriaCreada }) => {
    const [nombre, setNombre] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const nuevaCategoria = { nombre };
            const categoriaCreada = await crearCategoria(nuevaCategoria);
            onCategoriaCreada(categoriaCreada);
            setNombre("");
            alert("Categoría creada exitosamente");
        } catch (error) {
            console.error("Error creando categoría:", error);
            alert("No se pudo crear la categoría");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nombre de la Categoría:
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </label>
            <button type="submit">Crear Categoría</button>
        </form>
    );
};

export default FormularioCategoria;
