import { Link } from 'react-router-dom';

import '../styles/inicio.css';

function Inicio() {
  return (
    <div className="inicio">
      <div className="inicio-contenido">
        <h1>Bienvenido a Tienda</h1>

        <p>
          Administra tus productos, clientes y ventas
          desde un solo lugar.
        </p>

        <div className="inicio-acciones">
          <Link
            to="/productos"
            className="inicio-btn"
          >
            Ver productos
          </Link>

          <Link
            to="/ventas"
            className="inicio-btn inicio-btn-secundario"
          >
            Ver ventas
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Inicio;