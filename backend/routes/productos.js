var express = require('express');

var router = express.Router();

const pool = require('../db/database');


// GET - Obtener todos los productos

router.get('/', async function(req, res) {

    try {

        const result = await pool.query(
            'SELECT * FROM productos'
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener los productos'
        });

    }

});


// POST - Crear producto

router.post('/', async function(req, res) {

    try {

        const { nomProducto, stock, precio } = req.body;

        const result = await pool.query(
            `INSERT INTO productos
            (nomProducto, stock, precio)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [nomProducto, stock, precio]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al crear el producto'
        });

    }

});


// PUT - Actualizar producto

router.put('/:id', async function(req, res) {

    try {

        const id_producto = req.params.id;

        const { nomProducto, stock, precio } = req.body;

        const result = await pool.query(
            `UPDATE productos
            SET "nomProducto" = $1,
                stock = $2,
                precio = $3
            WHERE id_producto = $4
            RETURNING *`,
            [nomProducto, stock, precio, id_producto]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: 'Producto no encontrado'
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar el producto'
        });

    }

});


// DELETE - Eliminar producto

router.delete('/:id', async function(req, res) {

    try {

        const id_producto = req.params.id;

        const result = await pool.query(
            `DELETE FROM productos
            WHERE id_producto = $1
            RETURNING *`,
            [id_producto]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: 'Producto no encontrado'
            });

        }

        res.json({
            mensaje: 'Producto eliminado correctamente',
            producto: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al eliminar el producto'
        });

    }

});


module.exports = router;
