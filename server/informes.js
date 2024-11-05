// informes.js
const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// Endpoint para obtener los informes detallados de un árbitro específico
router.get('/', async (req, res) => {
    const arbitroId = req.query.arbitro_id;

    if (!arbitroId) {
        return res.status(400).json({ error: "Falta el parámetro arbitro_id" });
    }

    try {
        const [rows] = await db.query(
            `SELECT
                i.id AS informe_id,
                CONCAT(DATE_FORMAT(p.dia, '%d/%m/%Y'), ' ', TIME_FORMAT(p.hora, '%H:%i')) AS fecha_encuentro,
                c.nombre AS categoria,
                ea.nombre AS equipo_local,
                eb.nombre AS equipo_visitante,
                p.ubicacion AS campo,
                p.autobus AS transporte,
                p.anotaciones AS notas,
                a.alias AS tecnico
            FROM informes i
            JOIN partidos p ON i.partido_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            JOIN equipos ea ON p.equipo_a_id = ea.id
            JOIN equipos eb ON p.equipo_b_id = eb.id
            JOIN arbitros a ON i.evaluador_id = a.id
            WHERE i.arbitro_id = ?`,
            [arbitroId]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener informes:", error);
        res.status(500).json({ error: "Error al obtener informes" });
    }
});

module.exports = router;
