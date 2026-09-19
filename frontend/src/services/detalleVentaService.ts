import api from './api';

export interface DetalleVenta {
  id_venta: number;
  id_producto: number;
  nomcliente: string;
  fecha_venta: string;
  total: number;
  estado: string;
  nomproducto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export const obtenerDetalleVenta = async (
  id: number
): Promise<DetalleVenta[]> => {
  const response = await api.get<DetalleVenta[]>(
    `/detalle_venta/${id}`
  );

  return response.data;
};