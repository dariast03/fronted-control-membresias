import { useState, useEffect, useCallback } from 'react';
import type { Usuario, UpdateUsuarioRequest } from '../types/Usuario';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from './useAuth';

export const useUsuarios = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.obtenerTodos();
      setUsuarios(data);
    } catch (err) {
      setError('Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarUsuario = async (id: string, data: UpdateUsuarioRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await usuarioService.actualizar(id, data);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err) {
      setError('Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuario = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await usuarioService.obtenerPorId(id);
      return user;
    } catch (err) {
      setError('Error al obtener usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsuarios();
  }, [token, fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    actualizarUsuario,
    obtenerUsuario,
  };
};
