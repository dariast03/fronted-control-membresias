export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  imagenPerfilUrl: string | null;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  imagenPerfilUrl?: string;
  rol: string;
}

export interface LoginResponse {
  user: Usuario;
  token: string;
}

export interface UpdateUsuarioRequest {
  nombres?: string;
  apellidos?: string;
  email?: string;
  imagenPerfilUrl?: string;
  rol?: string;
}
