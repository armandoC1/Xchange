// src/app/ofertas/create/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { guardarOferta } from "@/app/services/ofertasService";
import { obtenerTodasCategorias } from "@/app/services/categoriaService";
import { obtenerUsuarioPorId } from "@/app/services/usuarioService";

interface Categoria {
  id: number;
  nombre: string;
}

export default function CrearOferta() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
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
        const response = await obtenerTodasCategorias();
        setCategorias(response.content); // Asegúrate de que `response.content` tiene el formato adecuado
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    const fetchUsuario = async () => {
      try {
        const idUsuario = sessionStorage.getItem("idUsuario");
        console.log('id desde creaar oferta: ', idUsuario)
        if (idUsuario) {
          const user = await obtenerUsuarioPorId(Number(idUsuario));
          setUserId(user.idUsuario);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await guardarOferta({
        ...ofertaData,
        idUsuario: userId,
      });

      alert("Oferta creada exitosamente");
      router.push("/ofertas");
    } catch (error) {
      console.error("Error al crear la oferta:", error);
      alert("Hubo un error al crear la oferta.");
    }
  };

  return (
    <div>
      <h1>Crear Nueva Oferta</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input
            type="text"
            name="titulo"
            value={ofertaData.titulo}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={ofertaData.descripcion}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Condición:
          <input
            type="text"
            name="condicion"
            value={ofertaData.condicion}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Ubicación:
          <input
            type="text"
            name="ubicacion"
            value={ofertaData.ubicacion}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Categoría:
          <select
            name="idCategoria"
            value={ofertaData.idCategoria}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Imágenes:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>

        <button type="submit">Crear Oferta</button>
      </form>
    </div>
  );
}
