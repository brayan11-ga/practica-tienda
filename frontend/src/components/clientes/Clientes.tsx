import { useEffect, useState } from 'react';

import {
  obtenerClientes,
  eliminarCliente,
  type Cliente
} from '../../services/clientesService';

import ClienteTable from './ClienteTable';
import ClienteForm from './ClienteForm';

import '../../styles/clientes.css';

function Clientes() {

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [cargando, setCargando] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const cargarClientes = async () => {

    try {

      const data = await obtenerClientes();

      setClientes(data);

    } catch (error) {

      setError('No se pudo cargar la lista de clientes');

      console.error(error);

    } finally {

      setCargando(false);

    }

  };

  useEffect(() => {

    cargarClientes();

  }, []);

  const handleEliminar = async (id: number) => {

  const confirmar = window.confirm(
    '¿Está seguro de eliminar este cliente?'
  );

  if (!confirmar) {
    return;
  }

  try {

    await eliminarCliente(id);

    await cargarClientes();

  } catch (error) {

    console.error(error);

    setError('No se pudo eliminar el cliente');

  }

};

  if (cargando) {
    return <p>Cargando clientes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="clientes">

      <h2>Listado de Clientes</h2>

      <ClienteForm
        onClienteCreado={cargarClientes}
        clienteEditando={clienteEditando}
      />

      <ClienteTable
        clientes={clientes}
        onEditar={setClienteEditando}
        onEliminar={handleEliminar}
      />

    </div>
  );
}

export default Clientes;