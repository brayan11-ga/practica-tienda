import { useEffect, useState } from 'react';

import {
  crearVenta,
  actualizarVenta,
  type Venta
} from '../../services/ventasService';

import {
  obtenerClientes,
  type Cliente
} from '../../services/clientesService';

import {
  obtenerProductos,
  type Producto
} from '../../services/productosService';

import '../../styles/ventaForm.css';

interface VentaFormProps {
  onVentaGuardada: () => void;
  ventaEditando: Venta | null;
  onCancelarEdicion: () => void;
}

interface ProductoSeleccionado {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

function VentaForm({
  onVentaGuardada,
  ventaEditando,
  onCancelarEdicion
}: VentaFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] =
    useState<ProductoSeleccionado[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState('');

  const [cantidad, setCantidad] = useState('1');

  const [formulario, setFormulario] = useState({
    id_cliente: '',
    fecha_venta: '',
    estado: 'Completada'
  });

  const [error, setError] = useState<string | null>(null);

  // Cargar clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        console.error(error);
        setError('No se pudieron cargar los clientes');
      }
    };

    cargarClientes();
  }, []);

  // Cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error(error);
        setError('No se pudieron cargar los productos');
      }
    };

    cargarProductos();
  }, []);

  // Cargar datos al editar
  useEffect(() => {
    if (ventaEditando) {
      setFormulario({
        id_cliente: String(ventaEditando.id_cliente),
        fecha_venta: ventaEditando.fecha_venta.split('T')[0],
        estado: ventaEditando.estado
      });
    } else {
      setFormulario({
        id_cliente: '',
        fecha_venta: '',
        estado: 'Completada'
      });

      setProductosSeleccionados([]);
    }
  }, [ventaEditando]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) {
      setError('Debe seleccionar un producto');
      return;
    }

    const cantidadNumerica = Number(cantidad);

    if (cantidadNumerica <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    const producto = productos.find(
      producto =>
        producto.id_producto === Number(productoSeleccionado)
    );

    if (!producto) {
      return;
    }

    if (cantidadNumerica > producto.stock) {
      setError(
        `Stock disponible: ${producto.stock}`
      );
      return;
    }

    const yaExiste = productosSeleccionados.find(
      item =>
        item.id_producto === producto.id_producto
    );

    if (yaExiste) {
      setError('El producto ya fue agregado');
      return;
    }

    const subtotal =
      Number(producto.precio) * cantidadNumerica;

    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        id_producto: producto.id_producto,
        nombre: producto.nomproducto,
        precio: Number(producto.precio),
        cantidad: cantidadNumerica,
        subtotal
      }
    ]);

    setProductoSeleccionado('');
    setCantidad('1');
    setError(null);
  };

  const eliminarProducto = (id_producto: number) => {
    setProductosSeleccionados(
      productosSeleccionados.filter(
        producto =>
          producto.id_producto !== id_producto
      )
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce(
      (total, producto) =>
        total + producto.subtotal,
      0
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formulario.id_cliente) {
      setError('Debe seleccionar un cliente');
      return;
    }

    if (!formulario.fecha_venta) {
      setError('La fecha es obligatoria');
      return;
    }

    if (productosSeleccionados.length === 0) {
      setError(
        'Debe agregar al menos un producto'
      );
      return;
    }

    const venta = {
      id_cliente: Number(formulario.id_cliente),
      fecha_venta: formulario.fecha_venta,
      estado: formulario.estado,
      productos: productosSeleccionados.map(
        producto => ({
          id_producto: producto.id_producto,
          cantidad: producto.cantidad
        })
      )
    };

    try {
      setError(null);

      if (ventaEditando) {
        await actualizarVenta(
          ventaEditando.id_venta,
          venta
        );
      } else {
        console.log('Venta que se enviará:', venta);
        await crearVenta(venta);
      }

      setFormulario({
        id_cliente: '',
        fecha_venta: '',
        estado: 'Completada'
      });

      setProductosSeleccionados([]);

      onVentaGuardada();
    } catch (error) {
      console.error(error);

      setError(
        ventaEditando
          ? 'No se pudo actualizar la venta'
          : 'No se pudo crear la venta'
      );
    }
  };

  return (
    <form
      className="venta-form"
      onSubmit={handleSubmit}
    >
      <div className="campo">
        <label htmlFor="id_cliente">
          Cliente
        </label>

        <select
          id="id_cliente"
          name="id_cliente"
          value={formulario.id_cliente}
          onChange={handleChange}
        >
          <option value="">
            Seleccione un cliente
          </option>

          {clientes.map(cliente => (
            <option
              key={cliente.id_cliente}
              value={cliente.id_cliente}
            >
              {cliente.nomcliente}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="fecha_venta">
          Fecha
        </label>

        <input
          type="date"
          id="fecha_venta"
          name="fecha_venta"
          value={formulario.fecha_venta}
          onChange={handleChange}
        />
      </div>

      <div className="campo">
        <label htmlFor="estado">
          Estado
        </label>

        <select
          id="estado"
          name="estado"
          value={formulario.estado}
          onChange={handleChange}
        >
          <option value="Completada">
            Completada
          </option>

          <option value="Pendiente">
            Pendiente
          </option>

          <option value="Cancelada">
            Cancelada
          </option>
        </select>
      </div>

      <hr />

      <h3>Agregar productos</h3>

      <div className="agregar-producto">
        <div className="campo">
          <label htmlFor="producto">
            Producto
          </label>

          <select
            id="producto"
            value={productoSeleccionado}
            onChange={e =>
              setProductoSeleccionado(
                e.target.value
              )
            }
          >
            <option value="">
              Seleccione un producto
            </option>

            {productos.map(producto => (
              <option
                key={producto.id_producto}
                value={producto.id_producto}
              >
                {producto.nomproducto} -
                ${Number(
                  producto.precio
                ).toLocaleString('es-CO')}
                {' '} (Stock: {producto.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="cantidad">
            Cantidad
          </label>

          <input
            type="number"
            id="cantidad"
            min="1"
            value={cantidad}
            onChange={e =>
              setCantidad(e.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="btn-agregar"
          onClick={agregarProducto}
        >
          Agregar producto
        </button>
      </div>

      {productosSeleccionados.length > 0 && (
        <>
          <h3>Productos de la venta</h3>

          <div className="productos-venta">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {productosSeleccionados.map(
                  producto => (
                    <tr
                      key={producto.id_producto}
                    >
                      <td>
                        {producto.nombre}
                      </td>

                      <td>
                        {producto.cantidad}
                      </td>

                      <td>
                        $
                        {producto.precio.toLocaleString(
                          'es-CO'
                        )}
                      </td>

                      <td>
                        $
                        {producto.subtotal.toLocaleString(
                          'es-CO'
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn-eliminar"
                          onClick={() =>
                            eliminarProducto(
                              producto.id_producto
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <h3 className="venta-total">
            Total: $
            {calcularTotal().toLocaleString(
              'es-CO'
            )}
          </h3>
        </>
      )}

      {error && (
        <p className="venta-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn-guardar"
      >
        {ventaEditando
          ? 'Actualizar venta'
          : 'Crear venta'}
      </button>

      <button
        type="button"
        className="btn-cancelar"
        onClick={onCancelarEdicion}
        >
        Cancelar
        </button>
    </form>
  );
}

export default VentaForm;

