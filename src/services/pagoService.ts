import type { PagoRequest, PagoResponse } from '../types/Pago';
import { backendApi } from '../lib/axios';

export const pagoService = {
  listar: async (): Promise<PagoResponse[]> => {
    const response = await backendApi.get('/Pago/listar');
    return response.data;
  },

  registrar: async (data: PagoRequest): Promise<PagoResponse> => {
    const response = await backendApi.post('/Pago/registrar', data);
    return response.data;
  },
};
