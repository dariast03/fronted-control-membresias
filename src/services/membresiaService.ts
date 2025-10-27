import type { Membresia, MembresiaResponse } from '../types/Membresia';
import { backendApi } from '../lib/axios';

export const membresiaService = {
  listar: async (): Promise<MembresiaResponse[]> => {
    const response = await backendApi.get('/Membresia/listar');
    return response.data;
  },

  obtenerPorUsuario: async (usuarioId: string): Promise<Membresia> => {
    const response = await backendApi.get(`/Membresia/usuario/${usuarioId}`);
    return response.data;
  },

  renovar: async (id: string): Promise<{ mensaje: string }> => {
    const response = await backendApi.put(`/Membresia/renovar/${id}`);
    return response.data;
  },
};
