import type { PagoRequest, PagoResponse } from '../types/Pago';
import { backendApi } from '../lib/axios';

export const pagoService = {
  registrar: async (data: PagoRequest): Promise<PagoResponse> => {
    const response = await backendApi.post('/Pago/registrar', data);
    return response.data;
  },
};
