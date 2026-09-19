var express = require('express');

var router = express.Router();

const pool = require('../db/database');

// Endpoint GET

router.get('/', async function(req, res){

    try {
        const result = await pool.query('SELECT * FROM clientes');

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener los clientes'
        });
    }

});

router.post('/', async function(req, res){
    try {
        const { nomCliente, contacto, departamento, ciudad } = req.body;

        const result = await pool.query(
            `INSERT INTO clientes
            (nomCliente, contacto, departamento, ciudad)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [nomCliente, contacto, departamento, ciudad]
        );

        res.status(201).json(result.rows[0]);

    }

    catch (eror) {
        console.error(eror);

        res.status(500).json({
            error: 'Error al crear el cliente'
        })
    }
})

router.put('/:id', async function(req, res) {

    try {

        const id_cliente = req.params.id;

        const { nomcliente, contacto, departamento, ciudad } = req.body;

        const result = await pool.query(
            `UPDATE clientes
            SET "nomcliente" = $1,
                contacto = $2,
                departamento = $3,
                ciudad = $4
            WHERE id_cliente = $5
            RETURNING *`,
            [nomcliente, contacto, departamento, ciudad, id_cliente]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar el cliente'
        });

    }

});

router.delete('/:id', async function(req, res) {

    try {

        const id_cliente = req.params.id;

        const result = await pool.query(
            `DELETE FROM clientes
            WHERE id_cliente = $1
            RETURNING *`,
            [id_cliente]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: 'Cliente no encontrado'
            });

        }

        res.json({
            mensaje: 'Cliente eliminado correctamente',
            cliente: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al eliminar el cliente'
        });

    }

});

module.exports = router;