"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { obtenerPorId, editarOferta } from "@/app/services/ofertasService";

interface Oferta {
  titulo: string;
  descripcion: string;
  condicion: string;
  ubicacion: string;
  idCategoria: number;
  imagenes: string[];
}

const condicionesValidas = ["Nuevo", "Usado", "Buena condición", "Reparado", "Defectuoso"];

export default function EditOfertaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idOferta = searchParams.get("id");

  const [formData, setFormData] = useState<Oferta>({
    titulo: "",
    descripcion: "",
    condicion: "",
    ubicacion: "",
    idCategoria: 0,
    imagenes: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        if (!idOferta) throw new Error("No se proporcionó el ID de la oferta.");

        const oferta = await obtenerPorId(idOferta);
        if (oferta) {
          setFormData({
            titulo: oferta.titulo,
            descripcion: oferta.descripcion,
            condicion: oferta.condicion,
            ubicacion: oferta.ubicacion,
            idCategoria: oferta.idCategoria,
            imagenes: oferta.imagenes || [],
          });
          setImagePreviews(oferta.imagenes || []); // Previsualización de imágenes existentes
        }
      } catch (error) {
        console.error("Error al cargar la oferta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la oferta.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOferta();
  }, [idOferta]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "idCategoria" ? parseInt(value) : value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews: string[] = [];
    const base64Promises: Promise<string>[] = [];

    files.forEach((file) => {
      previews.push(URL.createObjectURL(file));

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          }
        };
        reader.onerror = () => {
          reject("Error al convertir la imagen a Base64");
        };
        reader.readAsDataURL(file);
      });
      base64Promises.push(base64Promise);
    });

    Promise.all(base64Promises)
      .then((base64Images) => {
        setFormData({ ...formData, imagenes: [...formData.imagenes, ...base64Images] });
        setImagePreviews((prev) => [...prev, ...previews]);
      })
      .catch((error) => {
        console.error("Error al procesar las imágenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron procesar las imágenes.",
        });
      });
  };

  const handleEliminarImagen = (index: number) => {
    const nuevasImagenes = [...formData.imagenes];
    nuevasImagenes.splice(index, 1);

    const nuevasPreviews = [...imagePreviews];
    nuevasPreviews.splice(index, 1);

    setFormData({ ...formData, imagenes: nuevasImagenes });
    setImagePreviews(nuevasPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!idOferta) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo identificar la oferta.",
        });
        return;
      }

      await editarOferta(formData, idOferta); // Llamada al servicio de edición
      Swal.fire("¡Éxito!", "La oferta ha sido actualizada.", "success");
      router.push("/ofertas/mis");
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la oferta.",
      });
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Editar Oferta</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condición</label>
            <select
              name="condicion"
              value={formData.condicion}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccione una condición</option>
              {condicionesValidas.map((condicion) => (
                <option key={condicion} value={condicion}>
                  {condicion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Imágenes</label>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Imagen ${index + 1}`} className="w-full h-20 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleEliminarImagen(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
