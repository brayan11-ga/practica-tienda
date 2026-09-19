import type { Venta } from '../../services/ventasService';

import '../../styles/ventaTable.css';

interface VentaTableProps {
  ventas: Venta[];
  onEditar: (venta: Venta) => void;
  onEliminar: (id: number) => void;
  onVerDetalle: (id: number) => void;
}

function VentaTable({
  ventas,
  onEditar,
  onEliminar,
  onVerDetalle
}: VentaTableProps) {
  return (
    <div className="venta-table-container">
      <table className="venta-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>

              <td>{venta.id_cliente}</td>

              <td>{venta.fecha_venta}</td>

              <td>
                $
                {Number(venta.total).toLocaleString(
                  'es-CO'
                )}
              </td>

              <td>{venta.estado}</td>

              <td className="venta-acciones">
                <button
                  className="btn-editar"
                  onClick={() => onEditar(venta)}
                >
                  Editar
                </button>

                <button
                  className="btn-detalle"
                  onClick={() =>
                    onVerDetalle(venta.id_venta)
                  }
                >
                  Ver detalle
                </button>

                <button
                  className="btn-eliminar-venta"
                  onClick={() =>
                    onEliminar(venta.id_venta)
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

export default VentaTable;