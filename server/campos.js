const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM campos');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching campos:', error);
        res.status(500).send('Error fetching campos');
    }
});

router.delete('/', async (req, res) => {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).send('No se proporcionaron IDs para eliminar.');
    }

    try {
        const query = 'DELETE FROM campos WHERE id IN (?)';
        await db.query(query, [ids]);
        res.status(200).send('Campos eliminados con éxito.');
    } catch (error) {
        console.error('Error eliminando campos:', error);
        res.status(500).send('Error eliminando campos.');
    }
});

router.put('/', async (req, res) => {
    const campos = req.body;

    if (!campos || campos.length === 0) {
        return res.status(400).send('No se proporcionaron datos para actualizar.');
    }

    try {
        const promises = campos.map((campo) =>
            db.query('UPDATE campos SET nombre = ?, calle = ?, ubicacion = ? WHERE id = ?', [
                campo.nombre,
                campo.calle,
                campo.ubicacion,
                campo.id,
            ])
        );
        await Promise.all(promises);
        res.status(200).send('Campos actualizados con éxito.');
    } catch (error) {
        console.error('Error actualizando campos:', error);
        res.status(500).send('Error actualizando campos.');
    }
});

router.post('/', async (req, res) => {
    const { nombre, calle, ubicacion } = req.body;

    if (!nombre || !calle || !ubicacion) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    try {
        const query = 'INSERT INTO campos (nombre, calle, ubicacion) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nombre, calle, ubicacion]);
        const newCampo = { id: result.insertId, nombre, calle, ubicacion };
        res.status(201).json(newCampo); // Devuelve el nuevo registro creado
    } catch (error) {
        console.error('Error insertando campo:', error);
        res.status(500).send('Error insertando campo.');
    }
});


module.exports = router;