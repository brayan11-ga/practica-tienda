import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  obtenerVentas,
  eliminarVenta,
  type Venta
} from '../../services/ventasService';

import VentaTable from './VentaTable';
import VentaForm from './VentaForm';

import '../../styles/ventas.css';

function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [ventaEditando, setVentaEditando] =
    useState<Venta | null>(null);

  const navigate = useNavigate();

  const cargarVentas = async () => {
    try {
      const data = await obtenerVentas();

      setVentas(data);
      setError(null);

    } catch (error) {
      console.error(error);

      setError(
        'No se pudo cargar la lista de ventas'
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar esta venta?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarVenta(id);

      await cargarVentas();

    } catch (error) {
      console.error(error);

      setError(
        'No se pudo eliminar la venta'
      );
    }
  };

  const handleVentaGuardada = async () => {
    setVentaEditando(null);
    await cargarVentas();
  };

  const handleVerDetalle = (id: number) => {
    navigate(`/detalle_venta/${id}`);
  };

  if (cargando) {
  return (
    <p className="ventas-loading">
      Cargando ventas...
    </p>
  );
}

if (error) {
  return (
    <p className="ventas-error">
      {error}
    </p>
  );
}

  return (
    <div className="ventas-container">

      <h2>Listado de Ventas</h2>

      <VentaForm
        onVentaGuardada={handleVentaGuardada}
        ventaEditando={ventaEditando}
        onCancelarEdicion={() => setVentaEditando(null)}
      />

      <VentaTable
        ventas={ventas}
        onEditar={setVentaEditando}
        onEliminar={handleEliminar}
        onVerDetalle={handleVerDetalle}
      />

    </div>
  );
}

export default Ventas;
