import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  obtenerDetalleVenta,
  type DetalleVenta as DetalleVentaType
} from '../../services/detalleVentaService';

import '../../styles/detalleVenta.css';

function DetalleVenta() {
  const { id } = useParams();

  const [detalles, setDetalles] = useState<DetalleVentaType[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No se encontró el ID de la venta');
      setCargando(false);
      return;
    }

    const cargarDetalle = async () => {
      try {
        const data = await obtenerDetalleVenta(Number(id));

        setDetalles(data);
      } catch (error) {
        console.error(error);
        setError('No se pudo cargar el detalle de la venta');
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  if (cargando) {
    return <p>Cargando detalle de la venta...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (detalles.length === 0) {
    return <p>No se encontró el detalle de esta venta.</p>;
  }

  const venta = detalles[0];

  return (
    <div className="detalle-venta">

      <h2>Detalle de Venta</h2>

      <div className="detalle-venta-info">
        <p>Venta: {venta.id_venta}</p>
        <p>Cliente: {venta.nomcliente}</p>
        <p>Fecha: {venta.fecha_venta}</p>
        <p>Estado: {venta.estado}</p>
        <p>Total: {venta.total}</p>
      </div>

      <h3>Productos</h3>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {detalles.map((detalle, index) => (
            <tr key={index}>
              <td>{detalle.nomproducto}</td>
              <td>{detalle.cantidad}</td>
              <td>{detalle.precio_unitario}</td>
              <td>{detalle.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default DetalleVenta;