import { useState, useCallback } from 'react';
import type { MembresiaResponse } from '../types/Membresia';
import { membresiaService } from '../services/membresiaService';

export const useMembresiasList = () => {
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembresias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await membresiaService.listar();
      setMembresias(data);
    } catch (err: any) {
      setError('Error al obtener membresías');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    membresias,
    loading,
    error,
    fetchMembresias,
  };
};
