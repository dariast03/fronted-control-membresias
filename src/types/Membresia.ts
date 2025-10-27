export interface Membresia {
  id: string;
  planNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  monto: number;
}

export interface MembresiaResponse {
  id: string;
  planNombre: string;
  usuarioId: string;
  usuarioNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  monto: number;
}
