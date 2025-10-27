import type { Plan } from '../types/Plan';
import { backendApi } from '../lib/axios';

export const planService = {
  listar: async (): Promise<Plan[]> => {
    const response = await backendApi.get('/Plan/listar');
    return response.data;
  },
};
