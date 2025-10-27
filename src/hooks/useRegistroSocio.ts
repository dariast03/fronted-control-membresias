import { useState, useCallback } from 'react';
import type { Plan } from '../types/Plan';
import type { Usuario, RegisterRequest } from '../types/Usuario';
import type { Socio, RegistrarSocioRequest } from '../types/Socio';
import { planService } from '../services/planService';
import { usuarioService } from '../services/usuarioService';
import { socioService } from '../services/socioService';

export interface RegistroSocioData {
  // Datos del usuario
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  // Datos adicionales del socio
  profesion: string;
  direccion: string;
  telefono: string;
  membresiaPlanId: string;
}

export const useRegistroSocio = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await planService.listar();
      setPlanes(data);
    } catch (err) {
      setError('Error al obtener planes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarSocio = async (data: RegistroSocioData): Promise<Socio> => {
    setLoading(true);
    setError(null);
    try {
      // 1. Crear el usuario
      const usuarioData: RegisterRequest = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        password: data.password,
        rol: 'Socio',
      };

      const nuevoUsuario: Usuario = await usuarioService.registrar(usuarioData);

      // 2. Crear el socio con el plan seleccionado
      const socioData: RegistrarSocioRequest = {
        userId: nuevoUsuario.id,
        profesion: data.profesion,
        direccion: data.direccion,
        telefono: data.telefono,
        membresiaPlanId: data.membresiaPlanId,
      };

      const nuevoSocio: Socio = await socioService.registrar(socioData);

      return nuevoSocio;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al registrar socio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    planes,
    loading,
    error,
    fetchPlanes,
    registrarSocio,
  };
};
