import { useState, useEffect, useCallback } from 'react';
import type {
  Usuario,
  UpdateUsuarioRequest,
  RegisterRequest,
} from '../types/Usuario';
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

  const registrarUsuario = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await usuarioService.registrar(data);
      setUsuarios((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError('Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    registrarUsuario,
    actualizarUsuario,
    obtenerUsuario,
  };
};
