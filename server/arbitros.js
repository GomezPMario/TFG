const express = require('express');
const router = express.Router(); // Usa router en lugar de app
const db = require('./db_setup');

router.get('/', async (req, res) => {  // Usa '/' ya que el prefijo '/arbitros' se manejará en server.js
    let sql = 'SELECT * FROM arbitros WHERE 1=1'; // Base SQL query
    const { orderBy, search } = req.query;

    // Añadir ordenamiento dinámico
    if (orderBy) {
        if (['numero_colegiado', 'tipo_cargo', 'categoria', 'permiso'].includes(orderBy)) {
            sql += ` ORDER BY ${orderBy}`;
        }
    }

    // Añadir búsqueda
    if (search) {
        sql += ` AND (usuario LIKE '%${search}%' OR nombre LIKE '%${search}%' OR apellido LIKE '%${search}%' OR alias LIKE '%${search}%' OR numero_colegiado LIKE '%${search}%')`;
    }

    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        console.error('Error querying the database:', err);
        return res.status(500).send(err);
    }
});

module.exports = router; // Exporta el router
