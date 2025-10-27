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

  const obtenerSocioPorId = async (id: string): Promise<Socio> => {
    setLoading(true);
    setError(null);
    try {
      const socio = await socioService.obtenerPorId(id);
      return socio;
    } catch (err) {
      setError('Error al obtener socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarSocio = async (data: {
    id: string;
    cedulaIdentidad: string;
    profesion: string;
    estadoSocio: string;
  }): Promise<Socio> => {
    setLoading(true);
    setError(null);
    try {
      const socio = await socioService.actualizar(data);
      // Refetch después de actualizar
      await fetchSocios();
      return socio;
    } catch (err) {
      setError('Error al actualizar socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoSocio = async (
    id: string,
    estado: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await socioService.actualizarEstado(id, estado);
      // Refetch después de actualizar estado
      await fetchSocios();
    } catch (err) {
      setError('Error al actualizar estado del socio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarSocio = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await socioService.eliminar(id);
      // Refetch después de eliminar
      await fetchSocios();
    } catch (err) {
      setError('Error al eliminar socio');
      throw err;
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
    obtenerSocioPorId,
    actualizarSocio,
    actualizarEstadoSocio,
    eliminarSocio,
    refetchSocios: fetchSocios,
  };
};
