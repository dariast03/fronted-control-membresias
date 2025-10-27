import { useState, useCallback } from 'react';
import { backendApi } from '../lib/axios';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  leida: boolean;
}

export const useNotificaciones = (usuarioId?: string) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotificaciones = useCallback(async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await backendApi.get(
        `/Notificacion/usuario/${usuarioId}`
      );
      setNotificaciones(response.data);
    } catch (err: any) {
      setError('Error al obtener notificaciones');
      console.error('Error fetching notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  const marcarComoLeida = useCallback(async (notificacionId: string) => {
    try {
      // Aquí podrías hacer una llamada a la API para marcar como leída
      // await backendApi.put(`/Notificacion/${notificacionId}/leida`);

      // Por ahora, actualizamos localmente
      setNotificaciones((prev) =>
        prev.map((notif) =>
          notif.id === notificacionId ? { ...notif, leida: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  }, []);

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  return {
    notificaciones,
    loading,
    error,
    fetchNotificaciones,
    marcarComoLeida,
    notificacionesNoLeidas,
  };
};
