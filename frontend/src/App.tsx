import { Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import Clientes from './components/clientes/Clientes';
import Productos from './components/productos/Productos.tsx';
import Ventas from './components/ventas/Ventas.tsx';
import DetalleVenta from './components/ventas/DetalleVenta.tsx';

function App() {
  return (
    <>
      <Menu />

      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/detalle_venta/:id" element={<DetalleVenta />} />
      </Routes>
    </>
  );
}

export default App;