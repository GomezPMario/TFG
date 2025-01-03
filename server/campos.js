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

module.exports = router;