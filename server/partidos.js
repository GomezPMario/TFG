const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT
                p.id AS partido_id,
                CONCAT(ea.nombre, ' - ', eb.nombre) AS equipos,
                c.nombre AS categoria,
                CONCAT(p.dia, ' ', p.hora) AS fecha_partido,
                IFNULL(MAX(i.fecha), '--') AS fecha_informe,
                IFNULL(MAX(ae.alias), '--') AS tecnico,
                GROUP_CONCAT(DISTINCT CONCAT(ar.alias, ' ', ar.nombre, ' ', ar.apellido)) AS arbitros
            FROM
                partidos p
            LEFT JOIN
                equipos ea ON p.equipo_a_id = ea.id
            LEFT JOIN
                equipos eb ON p.equipo_b_id = eb.id
            LEFT JOIN
                categorias c ON p.categoria_id = c.id
            LEFT JOIN
                informes i ON p.id = i.partido_id
            LEFT JOIN
                arbitros ae ON i.evaluador_id = ae.id
            LEFT JOIN
                partidos_arbitros pa ON p.id = pa.partido_id
            LEFT JOIN
                arbitros ar ON pa.arbitro_id = ar.id AND ar.cargo = 1  -- Filtra árbitros con cargo 1
            GROUP BY
                p.id;


        `;

        const [results] = await db.query(query);
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
    } catch (error) {
        console.error("Error al obtener los partidos:", error);  // Registro detallado del error en el servidor
        res.status(500).json({ error: "Error al obtener los partidos" });
    }
});

router.get('/:arbitroId', async (req, res) => {
    const arbitroId = req.params.arbitroId;

    try {
        const query = `
            SELECT
                p.id AS partido_id,
                DATE_FORMAT(p.dia, '%d/%m/%Y') AS dia,
                TIME_FORMAT(p.hora, '%H:%i') AS hora,
                c.nombre AS categoria,
                ea.nombre AS equipoA,
                eb.nombre AS equipoB,
                ea.ubicacion AS campo,
                p.autobus AS autobus,
                p.anotaciones AS notas,
                f.nombre AS mi_funcion,
                CONCAT('[', GROUP_CONCAT(
                    JSON_OBJECT(
                        'arbitro_id', ac.id,
                        'numero_colegiado', ac.numero_colegiado,
                        'nombre', ac.nombre,
                        'apellido', ac.apellido,
                        'alias', ac.alias,
                        'telefono', ac.telefono,
                        'funcion', cf.nombre
                    )
                ), ']') AS companeros
            FROM partidos p
            JOIN partidos_arbitros pa ON p.id = pa.partido_id
            JOIN funciones f ON pa.funcion_id = f.id
            JOIN categorias c ON p.categoria_id = c.id
            JOIN equipos ea ON p.equipo_a_id = ea.id
            JOIN equipos eb ON p.equipo_b_id = eb.id
            LEFT JOIN partidos_arbitros pac ON p.id = pac.partido_id AND pac.arbitro_id != pa.arbitro_id
            LEFT JOIN arbitros ac ON pac.arbitro_id = ac.id
            LEFT JOIN funciones cf ON pac.funcion_id = cf.id
            WHERE pa.arbitro_id = ?
            GROUP BY p.id;
        `;

        const [results] = await db.query(query, [arbitroId]);
        console.log("Partidos obtenidos:", results);
        res.json(results);
    } catch (error) {
        console.error("Error al obtener los partidos:", error);
        res.status(500).json({ error: "Error al obtener los partidos" });
    }
});

module.exports = router;
