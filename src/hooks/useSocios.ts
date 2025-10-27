import { useState } from 'react';
import type { Socio, RegistrarSocioRequest } from '../types/Socio';
import { socioService } from '../services/socioService';

export const useSocios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarSocio = async (
    data: RegistrarSocioRequest
  ): Promise<Socio> => {
    setLoading(true);
    setError(null);
    try {
      const socio = await socioService.registrar(data);
      return socio;
    } catch (err) {
      setError('Error al registrar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    registrarSocio,
  };
};
