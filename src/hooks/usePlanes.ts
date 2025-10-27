import { useState, useEffect, useCallback } from 'react';
import type { Plan } from '../types/Plan';
import { planService } from '../services/planService';

export const usePlanes = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await planService.listar();
      setPlanes(data);
    } catch (err) {
      setError('Error al obtener planes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  return {
    planes,
    loading,
    error,
    fetchPlanes,
  };
};
