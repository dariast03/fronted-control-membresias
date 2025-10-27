import type { Socio, RegistrarSocioRequest } from '../types/Socio';
import { backendApi } from '../lib/axios';

export const socioService = {
  registrar: async (data: RegistrarSocioRequest): Promise<Socio> => {
    const response = await backendApi.post('/Socio/registrar', data);
    return response.data;
  },

  listar: async (): Promise<Socio[]> => {
    const response = await backendApi.get('/Socio/listar');
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Socio> => {
    const response = await backendApi.get(`/Socio/${id}`);
    return response.data;
  },

  actualizar: async (data: {
    id: string;
    cedulaIdentidad: string;
    profesion: string;
    estadoSocio: string;
  }): Promise<Socio> => {
    const response = await backendApi.put('/Socio/actualizar', data);
    return response.data;
  },

  actualizarEstado: async (id: string, estado: string): Promise<void> => {
    const response = await backendApi.put(
      `/Socio/${id}/estado`,
      JSON.stringify(estado),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  eliminar: async (id: string): Promise<void> => {
    const response = await backendApi.delete(`/Socio/${id}`);
    return response.data;
  },
};
