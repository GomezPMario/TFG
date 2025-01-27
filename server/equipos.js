const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    const { categoria_id, exclude_id } = req.query; // Leer parámetros de consulta
    let query = `
        SELECT
            e.id AS id,
            e.nombre AS nombre,
            c.nombre AS categoria_nombre,
            c.id AS categoria_id,
            ca.nombre AS campo_nombre,
            ca.id AS campo_id
        FROM
            equipos e
        LEFT JOIN
            categorias c ON e.categoria_id = c.id
        LEFT JOIN
            campos ca ON e.campo_id = ca.id
        WHERE 1=1
    `;
    const params = [];

    if (categoria_id) {
        query += ` AND e.categoria_id = ?`;
        params.push(categoria_id);
    }
    if (exclude_id) {
        query += ` AND e.id NOT IN (?)`;
        params.push(exclude_id);
    }

    try {
        const [rows] = await db.query(query, params);
        console.log('Equipos con filtros:', rows); // Log para verificar
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener equipos con filtros:', error);
        res.status(500).json({ error: 'Error al obtener los equipos.' });
    }
});

// Crear un nuevo equipo
router.post('/', async (req, res) => {
    const { nombre, categoria_id, campo_id } = req.body;

    if (!nombre || !categoria_id || !campo_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO equipos (nombre, categoria_id, campo_id) VALUES (?, ?, ?)',
            [nombre, categoria_id, campo_id]
        );
        res.status(201).json({ id: result[0].insertId, nombre, categoria_id, campo_id });
    } catch (error) {
        console.error('Error al crear el equipo:', error);
        res.status(500).json({ error: 'Error al crear el equipo' });
    }
});

// Actualizar un equipo
router.put('/', async (req, res) => {
    console.log("Datos recibidos para actualizar:", req.body);

    const equipos = req.body;

    if (!Array.isArray(equipos) || equipos.length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    // Validar los datos antes de actualizar
    for (const equipo of equipos) {
        if (!equipo.nombre || !equipo.categoria_id || !equipo.campo_id) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }
    }

    try {
        const promises = equipos.map((equipo) =>
            db.query(
                'UPDATE equipos SET nombre = ?, categoria_id = ?, campo_id = ? WHERE id = ?',
                [equipo.nombre, equipo.categoria_id, equipo.campo_id, equipo.id]
            )
        );

        await Promise.all(promises);

        res.json({ message: 'Equipos actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar los equipos:', error);
        res.status(500).json({ error: 'Error al actualizar los equipos.' });
    }
});

// Eliminar un equipo
router.delete('/', async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de IDs para eliminar equipos.' });
    }

    try {
        const placeholders = ids.map(() => '?').join(','); // Genera "?, ?, ?" según el número de IDs
        const query = `DELETE FROM equipos WHERE id IN (${placeholders})`;
        const result = await db.query(query, ids);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontraron equipos para eliminar.' });
        }

        res.json({ message: 'Equipos eliminados correctamente', deletedCount: result[0].affectedRows });
    } catch (error) {
        console.error('Error al eliminar los equipos:', error);
        res.status(500).json({ error: 'Error al eliminar los equipos' });
    }
});

module.exports = router;
