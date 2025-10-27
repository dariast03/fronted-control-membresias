import React, { createContext, useState, useEffect } from 'react';
import type { LoginResponse, Usuario } from '../types/Usuario';
import { usuarioService } from '../services/usuarioService';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResponse['user']>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  useEffect(() => {
    if (token) {
      // Aquí podrías verificar el token con la API si hay un endpoint para eso
      // Por ahora, asumimos que si hay token, está autenticado
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await usuarioService.login({ email, password });
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('token', response.token);

    return response.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
