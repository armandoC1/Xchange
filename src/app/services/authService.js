
import axiosInstance from './axiosInstance';

//ya funciona
export const login = async (correo_electronico, contrasena) => {
  try {
    const response = await axiosInstance.post('/usuarios/login', {
      correo_electronico,
      contrasena,
    });
    const { idUsuario } = response.data
    const { token } = response.data;
    sessionStorage.setItem('idUsuario', idUsuario)
    sessionStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    throw error;
  }
};

//ya funciona
export const register = async (usuarioData) => {
  try {
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
