import { backendApi } from '../lib/axios';

export interface DashboardStats {
  totalSocios: number;
  sociosActivos: number;
  renovacionesPendientes: number;
  ingresosTotales: number;
  pagosTotales: number;
}

export const dashboardService = {
  obtenerEstadisticas: async (): Promise<DashboardStats> => {
    const response = await backendApi.get('/Dashboard/estadisticas');
    return response.data;
  },
};
