import { useState, useEffect } from 'react';
import type { Socio, RegistrarSocioRequest } from '../types/Socio';
import { socioService } from '../services/socioService';

export const useSocios = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await socioService.listar();
      setSocios(data);
    } catch (err) {
      setError('Error al obtener socios');
    } finally {
      setLoading(false);
    }
  };

  const registrarSocio = async (
    data: RegistrarSocioRequest
  ): Promise<Socio> => {
    setLoading(true);
    setError(null);
    try {
      const socio = await socioService.registrar(data);
      // Después de registrar, refetch la lista
      await fetchSocios();
      return socio;
    } catch (err) {
      setError('Error al registrar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return {
    socios,
    loading,
    error,
    registrarSocio,
    refetchSocios: fetchSocios,
  };
};
