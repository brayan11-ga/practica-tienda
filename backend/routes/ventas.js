var express = require('express');

var router = express.Router();

const pool = require('../db/database');


// GET - Obtener todas las ventas

router.get('/', async function(req, res) {

    try {

        const result = await pool.query(
            'SELECT * FROM ventas'
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener las ventas'
        });
    }

});


// POST - Crear venta con productos

router.post('/', async function(req, res) {

    const client = await pool.connect();

    try {

        const {
            id_cliente,
            fecha_venta,
            estado,
            productos
        } = req.body;


        // Validaciones básicas

        if (!id_cliente || !fecha_venta || !estado) {

            return res.status(400).json({
                error: 'Faltan datos de la venta'
            });

        }


        if (!Array.isArray(productos) || productos.length === 0) {

            return res.status(400).json({
                error: 'La venta debe tener al menos un producto'
            });

        }


        await client.query('BEGIN');


        // Verificar que el cliente exista

        const cliente = await client.query(
            `SELECT id_cliente
             FROM clientes
             WHERE id_cliente = $1`,
            [id_cliente]
        );


        if (cliente.rows.length === 0) {

            throw new Error('El cliente no existe');

        }


        let total = 0;

        const detalles = [];


        // Procesar productos

        for (const producto of productos) {

            if (!producto.id_producto || !producto.cantidad) {

                throw new Error(
                    'Cada producto debe tener id_producto y cantidad'
                );

            }


            if (producto.cantidad <= 0) {

                throw new Error(
                    'La cantidad debe ser mayor a 0'
                );

            }


            // Buscar producto y bloquear la fila

            const resultadoProducto = await client.query(
                `SELECT id_producto, nomproducto, stock, precio
                 FROM productos
                 WHERE id_producto = $1
                 FOR UPDATE`,
                [producto.id_producto]
            );


            if (resultadoProducto.rows.length === 0) {

                throw new Error(
                    `El producto ${producto.id_producto} no existe`
                );

            }


            const productoBD = resultadoProducto.rows[0];


            // Verificar stock

            if (productoBD.stock < producto.cantidad) {

                throw new Error(
                    `Stock insuficiente para el producto ${productoBD.nomproducto}`
                );

            }


            // Calcular subtotal

            const subtotal =
                Number(productoBD.precio) *
                Number(producto.cantidad);


            total += subtotal;


            detalles.push({
                id_producto: productoBD.id_producto,
                cantidad: producto.cantidad,
                precio_unitario: productoBD.precio,
                subtotal
            });

        }


        // Crear la venta

        const venta = await client.query(
            `INSERT INTO ventas
            (id_cliente, fecha_venta, total, estado)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                id_cliente,
                fecha_venta,
                total,
                estado
            ]
        );


        const idVenta = venta.rows[0].id_venta;


        // Crear detalles y actualizar stock

        for (const detalle of detalles) {

            await client.query(
                `INSERT INTO detalle_venta
                (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    idVenta,
                    detalle.id_producto,
                    detalle.cantidad,
                    detalle.precio_unitario,
                    detalle.subtotal
                ]
            );


            await client.query(
                `UPDATE productos
                 SET stock = stock - $1
                 WHERE id_producto = $2`,
                [
                    detalle.cantidad,
                    detalle.id_producto
                ]
            );

        }


        await client.query('COMMIT');


        res.status(201).json({
            mensaje: 'Venta creada correctamente',
            venta: venta.rows[0],
            detalles
        });


    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.status(400).json({
            error: error.message
        });


    } finally {

        client.release();

    }

});


// PUT - Actualizar venta con productos y manejar stock

router.put('/:id', async function(req, res) {

    const client = await pool.connect();

    try {

        const id_venta = req.params.id;

        const {
            id_cliente,
            fecha_venta,
            estado,
            productos
        } = req.body;


        // Validaciones básicas

        if (!id_cliente || !fecha_venta || !estado) {

            return res.status(400).json({
                error: 'Faltan datos de la venta'
            });

        }


        if (!Array.isArray(productos) || productos.length === 0) {

            return res.status(400).json({
                error: 'La venta debe tener al menos un producto'
            });

        }


        await client.query('BEGIN');


        // 1. Verificar que la venta exista

        const ventaActual = await client.query(
            `SELECT id_venta
             FROM ventas
             WHERE id_venta = $1`,
            [id_venta]
        );


        if (ventaActual.rows.length === 0) {

            await client.query('ROLLBACK');

            return res.status(404).json({
                error: 'Venta no encontrada'
            });

        }


        // 2. Verificar que el cliente exista

        const cliente = await client.query(
            `SELECT id_cliente
             FROM clientes
             WHERE id_cliente = $1`,
            [id_cliente]
        );


        if (cliente.rows.length === 0) {

            throw new Error('El cliente no existe');

        }


        // 3. Obtener los detalles actuales de la venta

        const detallesActuales = await client.query(
            `SELECT id_producto, cantidad
             FROM detalle_venta
             WHERE id_venta = $1`,
            [id_venta]
        );


        // 4. Devolver al stock los productos de la venta anterior

        for (const detalle of detallesActuales.rows) {

            const producto = await client.query(
                `UPDATE productos
                 SET stock = stock + $1
                 WHERE id_producto = $2
                 RETURNING id_producto`,
                [
                    detalle.cantidad,
                    detalle.id_producto
                ]
            );


            if (producto.rows.length === 0) {

                throw new Error(
                    `El producto ${detalle.id_producto} no existe`
                );

            }

        }


        // 5. Eliminar los detalles anteriores

        await client.query(
            `DELETE FROM detalle_venta
             WHERE id_venta = $1`,
            [id_venta]
        );


        // 6. Verificar que no haya productos repetidos

        const idsProductos = productos.map(
            producto => Number(producto.id_producto)
        );

        const productosRepetidos =
            new Set(idsProductos).size !== idsProductos.length;


        if (productosRepetidos) {

            throw new Error(
                'No se puede agregar el mismo producto más de una vez'
            );

        }


        let total = 0;

        const nuevosDetalles = [];


        // 7. Validar y preparar los nuevos productos

        for (const producto of productos) {

            if (!producto.id_producto || !producto.cantidad) {

                throw new Error(
                    'Cada producto debe tener id_producto y cantidad'
                );

            }


            if (Number(producto.cantidad) <= 0) {

                throw new Error(
                    'La cantidad debe ser mayor a 0'
                );

            }


            // Buscar y bloquear el producto

            const resultadoProducto = await client.query(
                `SELECT id_producto, nomproducto, stock, precio
                 FROM productos
                 WHERE id_producto = $1
                 FOR UPDATE`,
                [producto.id_producto]
            );


            if (resultadoProducto.rows.length === 0) {

                throw new Error(
                    `El producto ${producto.id_producto} no existe`
                );

            }


            const productoBD = resultadoProducto.rows[0];


            // Verificar stock

            if (
                Number(productoBD.stock) <
                Number(producto.cantidad)
            ) {

                throw new Error(
                    `Stock insuficiente para el producto ${productoBD.nomproducto}`
                );

            }


            // Calcular subtotal

            const subtotal =
                Number(productoBD.precio) *
                Number(producto.cantidad);


            total += subtotal;


            nuevosDetalles.push({
                id_producto: productoBD.id_producto,
                cantidad: Number(producto.cantidad),
                precio_unitario: Number(productoBD.precio),
                subtotal
            });

        }


        // 8. Actualizar la venta

        const ventaActualizada = await client.query(
            `UPDATE ventas
             SET id_cliente = $1,
                 fecha_venta = $2,
                 total = $3,
                 estado = $4
             WHERE id_venta = $5
             RETURNING *`,
            [
                id_cliente,
                fecha_venta,
                total,
                estado,
                id_venta
            ]
        );


        // 9. Crear los nuevos detalles y descontar stock

        for (const detalle of nuevosDetalles) {

            await client.query(
                `INSERT INTO detalle_venta
                (
                    id_venta,
                    id_producto,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    id_venta,
                    detalle.id_producto,
                    detalle.cantidad,
                    detalle.precio_unitario,
                    detalle.subtotal
                ]
            );


            await client.query(
                `UPDATE productos
                 SET stock = stock - $1
                 WHERE id_producto = $2`,
                [
                    detalle.cantidad,
                    detalle.id_producto
                ]
            );

        }


        // 10. Confirmar todos los cambios

        await client.query('COMMIT');


        res.json({
            mensaje: 'Venta actualizada correctamente',
            venta: ventaActualizada.rows[0],
            detalles: nuevosDetalles
        });


    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.status(400).json({
            error: error.message
        });


    } finally {

        client.release();

    }

});

module.exports = router;