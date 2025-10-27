export interface Socio {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  cedulaIdentidad: string;
  profesion: string;
  estadoSocio: string;
  fechaRegistro: string;
}

export interface RegistrarSocioRequest {
  userId: string;
  profesion: string;
  direccion: string;
  telefono: string;
  membresiaPlanId: string;
}
