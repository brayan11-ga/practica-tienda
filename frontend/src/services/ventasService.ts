import api from './api';

export interface Venta {
  id_venta: number;
  id_cliente: number;
  fecha_venta: string;
  total: number;
  estado: string;
}

export interface ProductoVenta {
  id_producto: number;
  cantidad: number;
}

export interface NuevaVenta {
  id_cliente: number;
  fecha_venta: string;
  estado: string;
  productos: ProductoVenta[];
}

export const obtenerVentas = async (): Promise<Venta[]> => {
  const response = await api.get<Venta[]>('/ventas');
  return response.data;
};

export const crearVenta = async (
  venta: NuevaVenta
): Promise<Venta> => {
  const response = await api.post<Venta>('/ventas', venta);
  return response.data;
};

export const actualizarVenta = async (
  id: number,
  venta: NuevaVenta
): Promise<Venta> => {
  const response = await api.put<Venta>(
    `/ventas/${id}`,
    venta
  );

  return response.data;
};

export const eliminarVenta = async (id: number): Promise<void> => {
  await api.delete(`/ventas/${id}`);
};