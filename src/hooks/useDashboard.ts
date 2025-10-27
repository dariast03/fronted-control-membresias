import { useState, useEffect } from 'react';
import type { DashboardStats } from '../types/Dashboard';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.obtenerEstadisticas();
      setStats(data);
    } catch (err) {
      setError('Error al obtener estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetchStats: fetchStats,
  };
};
