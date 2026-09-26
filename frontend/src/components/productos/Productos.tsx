import { useEffect, useState } from 'react';

import {
  obtenerProductos,
  eliminarProducto,
  type Producto
} from '../../services/productosService';

import ProductoTable from './ProductoTable';
import ProductoForm from './ProductoForm';
import VentaModal from '../ventas/VentaModal';

import '../../styles/productos.css';

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();

      setProductos(data);
      setError(null);

    } catch (error) {
      setError(
        'No se pudo cargar la lista de productos'
      );

      console.error(error);

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este producto?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarProducto(id);
      await cargarProductos();

    } catch (error) {
      console.error(error);

      setError(
        'No se pudo eliminar el producto'
      );
    }
  };

  const handleAgregar = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleProductoGuardado = async () => {
    setMostrarFormulario(false);
    setProductoEditando(null);

    await cargarProductos();
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="productos">

      <div className="productos-header">

        <div>
          <h2>Listado de Productos</h2>

          <p>
            Administra los productos y el inventario.
          </p>
        </div>

        <button
          type="button"
          className="producto-btn-agregar"
          onClick={handleAgregar}
        >
          + Agregar producto
        </button>

      </div>

      <ProductoTable
        productos={productos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      <VentaModal
        abierto={mostrarFormulario}
        onCerrar={handleCancelar}
        titulo={
          productoEditando
            ? 'Editar producto'
            : 'Agregar producto'
        }
      >
        <ProductoForm
          onProductoGuardado={handleProductoGuardado}
          productoEditando={productoEditando}
          onCancelar={handleCancelar}
        />
      </VentaModal>

    </div>
  );
}

export default Productos;