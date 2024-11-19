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
                ea.ubicacion AS campo,  -- Ubicación basada en el equipo A
                a.alias AS tecnico,
                i.imagen,               -- Nuevo campo: imagen
                i.mecanica,             -- Nuevo campo: mecanica
                i.criterio,             -- Nuevo campo: criterio
                i.control_partido,      -- Nuevo campo: control_partido
                i.valoracion            -- Nuevo campo: valoracion
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
