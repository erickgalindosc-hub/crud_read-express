var express = require('express');
var router = express.Router();
var pool = require('../config/db');

// GET /ventas
router.get('/', async function(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM ventas');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener ventas' });
  }
});

// POST /ventas -> crear una nueva venta (requiere un id_cliente existente)
router.post('/', async function(req, res) {
  try {
    const { id_cliente, total, estado } = req.body;

    if (!id_cliente || total === undefined) {
      return res.status(400).json({ mensaje: 'id_cliente y total son obligatorios' });
    }

    const { rows } = await pool.query(
      'INSERT INTO ventas (id_cliente, total, estado) VALUES ($1, $2, $3) RETURNING *',
      [id_cliente, total, estado || 'pendiente']
    );

    const venta = rows[0];
    res.status(201).json({
      id_venta: venta.id_venta,
      id_cliente,
      fecha_venta: venta.fecha_venta,
      total,
      estado: estado || 'pendiente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la venta' });
  }
});

module.exports = router;