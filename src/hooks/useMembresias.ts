import { useState, useEffect, useCallback } from 'react';
import type { Membresia } from '../types/Membresia';
import { membresiaService } from '../services/membresiaService';
import { useAuth } from './useAuth';

export const useMembresias = () => {
  const { user } = useAuth();
  const [membresia, setMembresia] = useState<Membresia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembresia = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await membresiaService.obtenerPorUsuario(user.id);
      setMembresia(data);
    } catch (err) {
      setError('Error al obtener membresía');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const renovarMembresia = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await membresiaService.renovar(id);
      // Después de renovar, refetch
      await fetchMembresia();
      return result;
    } catch (err) {
      setError('Error al renovar membresía');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembresia();
  }, [fetchMembresia]);

  return {
    membresia,
    loading,
    error,
    fetchMembresia,
    renovarMembresia,
  };
};
