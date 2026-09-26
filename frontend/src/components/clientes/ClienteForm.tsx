import { useEffect, useState } from 'react';

import {
  crearCliente,
  actualizarCliente,
  type Cliente
} from '../../services/clientesService';

import '../../styles/clienteForm.css';

interface ClienteFormProps {
  onClienteCreado: () => void;
  onCancelar: () => void;
  clienteEditando: Cliente | null;

}

function ClienteForm({
  onClienteCreado,
  onCancelar,
  clienteEditando
}: ClienteFormProps) {
  const [formulario, setFormulario] = useState({
    nomCliente: '',
    contacto: '',
    departamento: '',
    ciudad: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clienteEditando) {
      setFormulario({
        nomCliente: clienteEditando.nomcliente,
        contacto: clienteEditando.contacto ?? '',
        departamento: clienteEditando.departamento ?? '',
        ciudad: clienteEditando.ciudad ?? ''
      });
    } else {
      setFormulario({
        nomCliente: '',
        contacto: '',
        departamento: '',
        ciudad: ''
      });
    }
  }, [clienteEditando]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formulario.nomCliente.trim()) {
      setError('El nombre del cliente es obligatorio');
      return;
    }

    try {
      setError(null);

      if (clienteEditando) {
        await actualizarCliente(
          clienteEditando.id_cliente,
          formulario
        );
      } else {
        await crearCliente(formulario);
      }

      setFormulario({
        nomCliente: '',
        contacto: '',
        departamento: '',
        ciudad: ''
      });

      onClienteCreado();
    } catch (error) {
      setError(
        clienteEditando
          ? 'No se pudo actualizar el cliente'
          : 'No se pudo crear el cliente'
      );

      console.error(error);
    }
  };

  return (
    <form
      className="cliente-form"
      onSubmit={handleSubmit}
    >
      <div className="cliente-campo">
        <label htmlFor="nomCliente">
          Nombre
        </label>

        <input
          type="text"
          id="nomCliente"
          name="nomCliente"
          value={formulario.nomCliente}
          onChange={handleChange}
        />
      </div>

      <div className="cliente-campo">
        <label htmlFor="contacto">
          Contacto
        </label>

        <input
          type="text"
          id="contacto"
          name="contacto"
          value={formulario.contacto}
          onChange={handleChange}
        />
      </div>

      <div className="cliente-campo">
        <label htmlFor="departamento">
          Departamento
        </label>

        <input
          type="text"
          id="departamento"
          name="departamento"
          value={formulario.departamento}
          onChange={handleChange}
        />
      </div>

      <div className="cliente-campo">
        <label htmlFor="ciudad">
          Ciudad
        </label>

        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formulario.ciudad}
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="cliente-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="cliente-btn-guardar"
      >
        {clienteEditando
          ? 'Actualizar cliente'
          : 'Crear cliente'}
      </button>

      <button
      type="button"
      className="cliente-btn-cancelar"
      onClick={onCancelar}
      >
      Cancelar
      </button>
      </form>
  );
}

export default ClienteForm;