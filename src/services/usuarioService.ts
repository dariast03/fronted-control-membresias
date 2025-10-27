import type {
  Usuario,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UpdateUsuarioRequest,
} from '../types/Usuario';
import { backendApi } from '../lib/axios';

export const usuarioService = {
  registrar: async (data: RegisterRequest): Promise<Usuario> => {
    const response = await backendApi.post('/Usuario/registrar', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await backendApi.post('/Usuario/login', data);
    return response.data;
  },

  actualizar: async (
    id: string,
    data: UpdateUsuarioRequest
  ): Promise<Usuario> => {
    const response = await backendApi.put(`/Usuario/actualizar/${id}`, data);
    return response.data;
  },

  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await backendApi.get('/Usuario');
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Usuario> => {
    const response = await backendApi.get(`/Usuario/${id}`);
    return response.data;
  },
};
