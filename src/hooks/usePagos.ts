import { useState } from 'react';
import type { PagoRequest, PagoResponse } from '../types/Pago';
import { pagoService } from '../services/pagoService';

export const usePagos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    loading,
    error,
    registrarPago,
  };
};
