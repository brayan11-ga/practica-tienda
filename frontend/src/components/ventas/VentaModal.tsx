import type { ReactNode } from 'react';

import '../../styles/ventaModal.css';

interface VentaModalProps {
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
  titulo: string;
}

function VentaModal({
  abierto,
  onCerrar,
  children,
  titulo
}: VentaModalProps) {

  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-contenido"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{titulo}</h2>

          <button
            type="button"
            className="modal-cerrar"
            onClick={onCerrar}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default VentaModal;