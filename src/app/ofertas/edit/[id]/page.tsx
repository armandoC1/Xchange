"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { obtenerPorId } from "@/app/services/ofertasService";
import Swal from "sweetalert2";
import axiosInstance from "@/app/services/axiosInstance";

interface Oferta {
  titulo: string;
  descripcion: string;
  condicion: string;
  ubicacion: string;
  idCategoria: number;
  imagenes: string[];
}

const condicionesValidas = ["Nuevo", "Usado", "Buena condición", "Reparado", "Defectuoso"];
const token = sessionStorage.getItem("token");
const EditarOferta = ({ idOferta }: { idOferta: number | null }) => {
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

  // Lógica para obtener la oferta a editar
  const fetchOferta = async () => {
    idOferta = 18
    console.log("id oferta: ", idOferta);
    try {
      if (!idOferta) throw new Error("No se proporcionó el ID de la oferta.");

      // Suponiendo que obtienes la oferta con un fetch
      const res = await obtenerPorId(idOferta);
      const oferta = await res.json();

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

  // Usamos useEffect para llamar fetchOferta cuando cambie el idOferta
  useEffect(() => {
    fetchOferta();
  }, [idOferta]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "idCategoria" ? parseInt(value) : value });
  };

  // Manejo de la carga de imágenes
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

  // Manejo de eliminación de imagen
  const handleEliminarImagen = (index: number) => {
    const nuevasImagenes = [...formData.imagenes];
    nuevasImagenes.splice(index, 1);

    const nuevasPreviews = [...imagePreviews];
    nuevasPreviews.splice(index, 1);

    setFormData({ ...formData, imagenes: nuevasImagenes });
    setImagePreviews(nuevasPreviews);
  };

  // Envío del formulario
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

      const formDataRequest = new FormData();
      formDataRequest.append(
        "oferta",
        new Blob([JSON.stringify(formData)], { type: "application/json" })
      );

      formData.imagenes.forEach((imagen, index) => {
        const base64String = imagen.startsWith("data:image/") ? imagen.split(",")[1] : imagen;
        const byteCharacters = atob(base64String);
        const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        formDataRequest.append("imagenes", blob, `imagen-${index}.jpeg`);
      });

      

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se ha encontrado el token de autenticación.",
        });
        return;
      }

      const res = await fetch(`http://api.xchangesv.es:8080/ofertas/edit/${idOferta}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formDataRequest,
      });

      if (res.ok) {
        Swal.fire("¡Éxito!", "La oferta ha sido actualizada.", "success");
      } else {
        console.error("Error al actualizar la oferta:", await res.text());
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la oferta.",
        });
      }
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
    <div>
      <h1>Editar Oferta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} />
        </div>

        <div>
          <label>Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}></textarea>
        </div>

        <div>
          <label>Condición</label>
          <select name="condicion" value={formData.condicion} onChange={handleChange}>
            <option value="">Seleccione una condición</option>
            {condicionesValidas.map((condicion) => (
              <option key={condicion} value={condicion}>
                {condicion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Imágenes</label>
          <div>
            {imagePreviews.map((preview, index) => (
              <div key={index}>
                <img src={preview} alt={`Imagen ${index + 1}`} />
                <button type="button" onClick={() => handleEliminarImagen(index)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarOferta;
