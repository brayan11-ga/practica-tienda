import type { Cliente } from '../../services/clientesService';

import '../../styles/clienteTable.css';

interface ClienteTableProps {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (id: number) => void;
}

function ClienteTable({
  clientes,
  onEditar,
  onEliminar
}: ClienteTableProps) {
  return (
    <div className="cliente-table-container">
      <table className="cliente-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Departamento</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>

              <td>{cliente.nomcliente}</td>

              <td>{cliente.contacto || '-'}</td>

              <td>{cliente.departamento || '-'}</td>

              <td>{cliente.ciudad || '-'}</td>

              <td className="cliente-acciones">
                <button
                  className="cliente-btn-editar"
                  onClick={() => onEditar(cliente)}
                >
                  Editar
                </button>

                <button
                  className="cliente-btn-eliminar"
                  onClick={() =>
                    onEliminar(cliente.id_cliente)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteTable;