import type { Socio, RegistrarSocioRequest } from '../types/Socio';
import { backendApi } from '../lib/axios';

export const socioService = {
  registrar: async (data: RegistrarSocioRequest): Promise<Socio> => {
    const response = await backendApi.post('/Socio/registrar', data);
    return response.data;
  },
};
