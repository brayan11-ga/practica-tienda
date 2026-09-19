var express = require('express');

var router = express.Router();

const pool = require('../db/database');

router.get('/:id', async function(req, res) {

    try {

        const idVenta = req.params.id;

        const result = await pool.query(`
            SELECT
                v.id_venta,
                c.nomcliente,
                v.fecha_venta,
                v.total,
                v.estado,
                p.nomproducto,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
            FROM ventas v
            INNER JOIN clientes c
                ON v.id_cliente = c.id_cliente
            INNER JOIN detalle_venta dv
                ON v.id_venta = dv.id_venta
            INNER JOIN productos p
                ON dv.id_producto = p.id_producto
            WHERE v.id_venta = $1
        `, [idVenta]);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener el detalle de la venta'
        });

    }

});

module.exports = router;