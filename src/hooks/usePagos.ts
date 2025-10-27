import { useState, useCallback } from 'react';
import type { PagoRequest, PagoResponse } from '../types/Pago';
import { pagoService } from '../services/pagoService';

export const usePagos = () => {
  const [pagos, setPagos] = useState<PagoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pagoService.listar();
      setPagos(data);
    } catch (err: any) {
      setError('Error al obtener pagos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarPago = async (data: PagoRequest): Promise<PagoResponse> => {
    setLoading(true);
    setError(null);
    try {
      const pago = await pagoService.registrar(data);
      return pago;
    } catch (err) {
      setError('Error al registrar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pagos,
    loading,
    error,
    fetchPagos,
    registrarPago,
  };
};
