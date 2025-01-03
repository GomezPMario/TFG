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


module.exports = router;