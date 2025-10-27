export interface PagoRequest {
  usuarioId: string;
  membresiaId: string;
  monto: number;
  metodoPago: string;
}

export interface PagoResponse {
  id: string;
  usuarioNombre: string | null;
  monto: number;
  estado: string;
  fechaPago: string;
}
