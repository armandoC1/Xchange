// authService.js
import axiosInstance from './axiosInstance';

export const login = async (correo_electronico, contrasena) => {
  try {
    const response = await axiosInstance.post('/usuarios/login', {
      correo_electronico, // Cambio para que coincida con el nombre del campo en la tabla
      contrasena,          // Cambio para que coincida con el nombre del campo en la tabla
    });
    const { token } = response.data;
    localStorage.setItem('token', token); // Almacenar el token en localStorage
    return token;
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    throw error;
  }
};

export const register = async (usuarioData) => {
  try {
    // Asegúrate de pasar todos los datos necesarios según tu tabla
    const response = await axiosInstance.post('/usuarios/registro', {
      correo_electronico: usuarioData.correo_electronico,
      contrasena: usuarioData.contrasena,
      nombre_usuario: usuarioData.nombre_usuario,
      estado: usuarioData.estado,  // Si necesitas incluir el estado por defecto
      ubicacion: usuarioData.ubicacion,
      numero_telefono: usuarioData.numero_telefono, // Incluye todos los campos relevantes
      foto_perfil: usuarioData.foto_perfil,  // Asumiendo que es una URL o base64
      rol_id: usuarioData.rol_id,  // Rol del usuario (1 para user, 2 para admin)
    });
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};
