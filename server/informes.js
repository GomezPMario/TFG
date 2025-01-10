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
                ca.nombre AS campo,       -- Nombre del campo desde la tabla campos
                ca.ubicacion AS ubicacion, -- Ubicación del campo desde la tabla campos
                a.alias AS tecnico,
                i.imagen,
                i.mecanica,
                i.criterio,
                i.control_partido,
                i.valoracion
            FROM informes i
            JOIN partidos p ON i.partido_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            JOIN equipos ea ON p.equipo_a_id = ea.id
            JOIN equipos eb ON p.equipo_b_id = eb.id
            LEFT JOIN campos ca ON p.campo_id = ca.id -- Relación con la tabla campos
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

router.post('/', async (req, res) => {
    const { partido_id, arbitro_id, evaluador_id, fecha, imagen, mecanica, criterio, control_partido, valoracion } = req.body;

    if (!partido_id || !arbitro_id || !evaluador_id || !fecha) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    try {
        const query = `
            INSERT INTO informes (partido_id, arbitro_id, evaluador_id, fecha, imagen, mecanica, criterio, control_partido, valoracion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await db.query(query, [
            partido_id,
            arbitro_id,
            evaluador_id,
            fecha,
            imagen || null,
            mecanica || null,
            criterio || null,
            control_partido || null,
            valoracion || null,
        ]);
        res.status(201).json({ message: 'Informe creado con éxito.' });
    } catch (error) {
        console.error('Error al crear informe:', error);
        res.status(500).json({ error: 'Error al crear informe.' });
    }
});

module.exports = router;
