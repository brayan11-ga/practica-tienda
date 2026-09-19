import api from './api';

export interface Producto {
  id_producto: number;
  nomproducto: string;
  stock: number;
  precio: number;
}

export interface NuevoProducto {
  nomProducto: string;
  stock: number;
  precio: number;
}

export const obtenerProductos = async (): Promise<Producto[]> => {

  const response = await api.get<Producto[]>('/productos');

  return response.data;

};

export const crearProducto = async (
  producto: NuevoProducto
): Promise<Producto> => {

  const response = await api.post<Producto>('/productos', producto);

  return response.data;

};

export const actualizarProducto = async (
  id: number,
  producto: NuevoProducto
): Promise<Producto> => {

  const response = await api.put<Producto>(
    `/productos/${id}`,
    producto
  );

  return response.data;

};

export const eliminarProducto = async (id: number): Promise<void> => {

  await api.delete(`/productos/${id}`);

};