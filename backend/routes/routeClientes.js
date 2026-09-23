var express = require('express');
var router = express.Router();
var pool = require('../config/db');

// GET /clientes
router.get('/', async function(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
});

// POST /clientes -> crear un nuevo cliente
router.post('/', async function(req, res) {
  try {
    const { nomCliente, contacto, departamento, ciudad } = req.body;

    if (!nomCliente) {
      return res.status(400).json({ mensaje: 'El nombre del cliente es obligatorio' });
    }

    const { rows } = await pool.query(
      'INSERT INTO clientes ("nomCliente", contacto, departamento, ciudad) VALUES ($1, $2, $3, $4) RETURNING *',
      [nomCliente, contacto, departamento, ciudad]
    );

    const cliente = rows[0];
    res.status(201).json({
      id_cliente: cliente.id_cliente,
      nomCliente,
      contacto,
      departamento,
      ciudad
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el cliente' });
  }
});

module.exports = router;