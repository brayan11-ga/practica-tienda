import type { Producto } from '../../services/productosService';

import '../../styles/productoTable.css';

interface ProductoTableProps {
  productos: Producto[];
  onEditar: (producto: Producto) => void;
  onEliminar: (id: number) => void;
}

function ProductoTable({
  productos,
  onEditar,
  onEliminar
}: ProductoTableProps) {
  return (
    <div className="producto-table-container">
      <table className="producto-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map(producto => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>

              <td>{producto.nomproducto}</td>

              <td>
                <span
                  className={
                    producto.stock === 0
                      ? 'stock-agotado'
                      : producto.stock <= 5
                      ? 'stock-bajo'
                      : 'stock-disponible'
                  }
                >
                  {producto.stock}
                </span>
              </td>

              <td>
                $
                {Number(producto.precio).toLocaleString(
                  'es-CO'
                )}
              </td>

              <td className="producto-acciones">
                <button
                  className="producto-btn-editar"
                  onClick={() => onEditar(producto)}
                >
                  Editar
                </button>

                <button
                  className="producto-btn-eliminar"
                  onClick={() =>
                    onEliminar(producto.id_producto)
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

export default ProductoTable;