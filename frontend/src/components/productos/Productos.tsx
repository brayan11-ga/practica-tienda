import { useEffect, useState } from 'react';

import {
  obtenerProductos,
  eliminarProducto,
  type Producto
} from '../../services/productosService';

import ProductoTable from './ProductoTable';
import ProductoForm from './ProductoForm';

import '../../styles/productos.css';

function Productos() {

  const [productos, setProductos] = useState<Producto[]>([]);

  const [cargando, setCargando] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  const cargarProductos = async () => {

    try {

      const data = await obtenerProductos();

      setProductos(data);

    } catch (error) {

      setError('No se pudo cargar la lista de productos');

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

      setError('No se pudo eliminar el producto');

    }

  };

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="productos">

      <h2>Listado de Productos</h2>

      <ProductoForm
        onProductoGuardado={cargarProductos}
        productoEditando={productoEditando}
      />

      <ProductoTable
        productos={productos}
        onEditar={setProductoEditando}
        onEliminar={handleEliminar}
      />

    </div>
  );
}

export default Productos;