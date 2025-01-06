const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT
                e.id AS equipo_id,
                e.nombre AS equipo_nombre,
                c.nombre AS categoria_nombre,
                c.id AS categoria_id,
                ca.nombre AS campo_nombre,
                ca.id AS campo_id
            FROM
                equipos e
            LEFT JOIN
                categorias c ON e.categoria_id = c.id
            LEFT JOIN
                campos ca ON e.campo_id = ca.id;
        `;
        const [rows] = await db.query(query);
        console.log("Equipos con categorías:", rows); // Agrega esto para verificar
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener equipos con categorías:', error);
        res.status(500).json({ error: 'Error al obtener los equipos con sus categorías' });
    }
});

// Crear un nuevo equipo
router.post('/', async (req, res) => {
    const { nombre, categoria_id, campo } = req.body;

    if (!nombre || !categoria_id || !campo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await db.query('INSERT INTO equipos (nombre, categoria_id, campo) VALUES (?, ?, ?)', [nombre, categoria_id, campo]);
        res.status(201).json({ id: result[0].insertId, nombre, categoria_id, campo });
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
        res.status(500).json({ error: 'Error al actualizar los equipos' });
    }
});


// Eliminar un equipo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM equipos WHERE id = ?', [id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }

        res.json({ message: 'Equipo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el equipo:', error);
        res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
});

module.exports = router;
