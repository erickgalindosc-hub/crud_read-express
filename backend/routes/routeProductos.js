var express = require('express');
var router = express.Router();
var pool = require('../config/db');

// GET /productos
router.get('/', async function(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// POST /productos -> crear un nuevo producto
router.post('/', async function(req, res) {
  try {
    const { nomProducto, cantidad, precio } = req.body;

    if (!nomProducto || precio === undefined) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }

    const { rows } = await pool.query(
      'INSERT INTO productos ("nomProducto", cantidad, precio) VALUES ($1, $2, $3) RETURNING *',
      [nomProducto, cantidad || 0, precio]
    );

    const producto = rows[0];
    res.status(201).json({
      id_producto: producto.id_producto,
      nomProducto,
      cantidad: cantidad || 0,
      precio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
});

module.exports = router;