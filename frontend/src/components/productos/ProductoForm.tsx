import { useEffect, useState } from 'react';

import {
  crearProducto,
  actualizarProducto,
  type Producto
} from '../../services/productosService';

import '../../styles/productoForm.css';

interface ProductoFormProps {
  onProductoGuardado: () => void;
  onCancelar: () => void;
  productoEditando: Producto | null;
}

function ProductoForm({
  onProductoGuardado,
  onCancelar,
  productoEditando
}: ProductoFormProps) {
  const [formulario, setFormulario] = useState({
    nomProducto: '',
    stock: '',
    precio: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productoEditando) {
      setFormulario({
        nomProducto: productoEditando.nomproducto,
        stock: String(productoEditando.stock),
        precio: String(productoEditando.precio)
      });
    } else {
      setFormulario({
        nomProducto: '',
        stock: '',
        precio: ''
      });
    }
  }, [productoEditando]);

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

    if (!formulario.nomProducto.trim()) {
      setError('El nombre del producto es obligatorio');
      return;
    }

    if (
      formulario.stock === '' ||
      Number(formulario.stock) < 0
    ) {
      setError('El stock debe ser un número válido');
      return;
    }

    if (
      formulario.precio === '' ||
      Number(formulario.precio) <= 0
    ) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    const producto = {
      nomProducto: formulario.nomProducto,
      stock: Number(formulario.stock),
      precio: Number(formulario.precio)
    };

    try {
      setError(null);

      if (productoEditando) {
        await actualizarProducto(
          productoEditando.id_producto,
          producto
        );
      } else {
        await crearProducto(producto);
      }

      setFormulario({
        nomProducto: '',
        stock: '',
        precio: ''
      });

      onProductoGuardado();
    } catch (error) {
      setError(
        productoEditando
          ? 'No se pudo actualizar el producto'
          : 'No se pudo crear el producto'
      );

      console.error(error);
    }
  };

  return (
    <form
      className="producto-form"
      onSubmit={handleSubmit}
    >
      <div className="producto-campo">
        <label htmlFor="nomProducto">
          Nombre
        </label>

        <input
          type="text"
          id="nomProducto"
          name="nomProducto"
          value={formulario.nomProducto}
          onChange={handleChange}
          placeholder="Nombre del producto"
        />
      </div>

      <div className="producto-campo">
        <label htmlFor="stock">
          Stock
        </label>

        <input
          type="number"
          id="stock"
          name="stock"
          min="0"
          value={formulario.stock}
          onChange={handleChange}
          placeholder="Cantidad disponible"
        />
      </div>

      <div className="producto-campo">
        <label htmlFor="precio">
          Precio
        </label>

        <input
          type="number"
          id="precio"
          name="precio"
          min="0"
          step="0.01"
          value={formulario.precio}
          onChange={handleChange}
          placeholder="Precio del producto"
        />
      </div>

      {error && (
        <p className="producto-error">
          {error}
        </p>
      )}

      <button
  type="submit"
  className="producto-btn-guardar"
>
  {productoEditando
    ? 'Actualizar producto'
    : 'Crear producto'}
</button>

<button
  type="button"
  className="producto-btn-cancelar"
  onClick={onCancelar}
>
  Cancelar
</button>
    </form>
  );
}

export default ProductoForm;