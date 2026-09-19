import api from './api';

export interface Cliente {
  id_cliente: number;
  nomcliente: string;
  contacto: string | null;
  departamento: string | null;
  ciudad: string | null;
}

export interface NuevoCliente {
  nomCliente: string;
  contacto: string;
  departamento: string;
  ciudad: string;
}

export const obtenerClientes = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>('/clientes');

  return response.data;
};

export const crearCliente = async (cliente: NuevoCliente): Promise<Cliente> => {
  const response = await api.post<Cliente>('/clientes', cliente);

  return response.data;
};

export const actualizarCliente = async (
  id: number,
  cliente: NuevoCliente
): Promise<Cliente> => {
  const response = await api.put<Cliente>(`/clientes/${id}`, cliente);

  return response.data;
};

export const eliminarCliente = async (id: number): Promise<void> => {

  await api.delete(`/clientes/${id}`);

};