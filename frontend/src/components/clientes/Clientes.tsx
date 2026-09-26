import { useEffect, useState } from 'react';

import {
  obtenerClientes,
  eliminarCliente,
  type Cliente
} from '../../services/clientesService';

import ClienteTable from './ClienteTable';
import ClienteForm from './ClienteForm';
import VentaModal from '../ventas/VentaModal';

import '../../styles/clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();

      setClientes(data);
      setError(null);

    } catch (error) {
      setError(
        'No se pudo cargar la lista de clientes'
      );

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

      setError(
        'No se pudo eliminar el cliente'
      );
    }
  };

  const handleAgregar = () => {
    setClienteEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setMostrarFormulario(true);
  };

  const handleClienteGuardado = async () => {
    setMostrarFormulario(false);
    setClienteEditando(null);

    await cargarClientes();
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setClienteEditando(null);
  };

  if (cargando) {
    return <p>Cargando clientes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="clientes">

      <div className="clientes-header">

        <div>
          <h2>Listado de Clientes</h2>

          <p>
            Administra los clientes registrados.
          </p>
        </div>

        <button
          type="button"
          className="cliente-btn-agregar"
          onClick={handleAgregar}
        >
          + Agregar cliente
        </button>

      </div>

      <ClienteTable
        clientes={clientes}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      <VentaModal
        abierto={mostrarFormulario}
        onCerrar={handleCancelar}
        titulo={
          clienteEditando
            ? 'Editar cliente'
            : 'Agregar cliente'
        }
      >
        <ClienteForm
          onClienteCreado={handleClienteGuardado}
          onCancelar={handleCancelar}
          clienteEditando={clienteEditando}
        />
      </VentaModal>

    </div>
  );
}

export default Clientes;