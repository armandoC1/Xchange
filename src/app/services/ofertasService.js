import axiosInstance from "./axiosInstance";

export const listadoPaginado = async () =>{
    try {
        const response = await axiosInstance.get('/ofertas',{
            
        });
    } catch (error) {
        
    }
}