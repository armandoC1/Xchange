// authService.js
import axiosInstance from './axiosInstance';

export const login = async (correo_electronico, contrasena) => {
  try {
    const response = await axiosInstance.post('/usuarios/login', {
      correo_electronico,
      contrasena,      
    });
    const { token } = response.data;
    sessionStorage.setItem('token', token); // Almacenar el token en localStorage
    return token;
  } catch (error) {
    console.log(correo_electronico)
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
      estado: usuarioData.estado,  
      ubicacion: usuarioData.ubicacion,
      numero_telefono: usuarioData.numero_telefono, 
      foto_perfil: usuarioData.foto_perfil,  
      rol_id: usuarioData.rol_id, 
    });
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};
