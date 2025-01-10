const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// listado de partidos
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

// consultas
router.get('/intervalo/:arbitroId', async (req, res) => {
    const { startDate, endDate } = req.query;
    const { arbitroId } = req.params;

    if (!startDate || !endDate || !arbitroId) {
        return res.status(400).json({ error: "Se requieren los parámetros 'startDate', 'endDate' y 'arbitroId'" });
    }

    try {
        const query = `
            SELECT
                p.id AS partido_id,
                p.dia AS dia,
                TIME_FORMAT(p.hora, '%H:%i') AS hora,
                c.nombre AS categoria,
                ea.nombre AS equipoA,
                eb.nombre AS equipoB,
                ca.nombre AS campo,
                ca.calle AS direccion,
                ca.ubicacion AS ubicacion,
                p.anotaciones AS notas,
                p.resultado_a,
                p.resultado_b,
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
            LEFT JOIN campos ca ON p.campo_id = ca.id
            WHERE pa.arbitro_id = ? 
              AND DATE(p.dia) BETWEEN DATE(?) AND DATE(?)
            GROUP BY p.id, pa.arbitro_id
            ORDER BY p.dia ASC, p.hora ASC;
        `;

        const [results] = await db.query(query, [arbitroId, startDate, endDate]);
        res.json(results);
    } catch (error) {
        console.error("Error al ejecutar el query:", error);
        res.status(500).json({ error: "Error al obtener los partidos" });
    }
});

// Actualizar resultados de un partido
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { resultado_a, resultado_b } = req.body;

    console.log("Valores recibidos:", { id, resultado_a, resultado_b }); // Verifica los valores

    if (resultado_a === undefined || resultado_b === undefined) {
        return res.status(400).json({ error: "Faltan valores para resultado_a y resultado_b" });
    }

    try {
        const query = `
            UPDATE partidos
            SET resultado_a = ?, resultado_b = ?
            WHERE id = ?;
        `;

        const [result] = await db.query(query, [resultado_a, resultado_b, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Partido no encontrado" });
        }

        res.json({ message: "Resultados actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar resultados:", error);
        res.status(500).json({ error: "Error al actualizar resultados" });
    }
});

router.get('/:partidoId/detalles', async (req, res) => {
    const { partidoId } = req.params;

    try {
        const query = `
            SELECT 
                CONCAT(DATE_FORMAT(p.dia, '%d/%m/%Y'), ' ', TIME_FORMAT(p.hora, '%H:%i')) AS fecha_encuentro,
                c.nombre AS categoria,
                ea.nombre AS equipo_local,
                eb.nombre AS equipo_visitante,
                COALESCE(ca.nombre, 'Sin campo asignado') AS campo,
                COALESCE(MAX(ae.alias), 'Sin técnico asignado') AS tecnico,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', ar.id,
                        'alias', ar.alias,
                        'nombre', ar.nombre,
                        'apellido', ar.apellido,
                        'funcion', f.nombre,
                        'telefono', ar.telefono
                    )
                ) AS arbitros
            FROM partidos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN equipos ea ON p.equipo_a_id = ea.id
            LEFT JOIN equipos eb ON p.equipo_b_id = eb.id
            LEFT JOIN campos ca ON p.campo_id = ca.id
            LEFT JOIN informes i ON p.id = i.partido_id
            LEFT JOIN arbitros ae ON i.evaluador_id = ae.id
            LEFT JOIN partidos_arbitros pa ON p.id = pa.partido_id
            LEFT JOIN arbitros ar ON pa.arbitro_id = ar.id
            LEFT JOIN funciones f ON pa.funcion_id = f.id -- Unión para obtener la función del árbitro
            WHERE p.id = ?
            GROUP BY p.id, c.nombre, ea.nombre, eb.nombre, ca.nombre;
        `;

        const [result] = await db.query(query, [partidoId]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Partido no encontrado" });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener los detalles del partido:", error);
        res.status(500).json({ error: "Error al obtener los detalles del partido" });
    }
});


// aqui falta cambiarlo por nominas o algo asi 
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
            GROUP BY p.id
            ORDER BY p.dia ASC, p.hora ASC; -- Ordena por fecha y hora de manera ascendente
        `;

        const [results] = await db.query(query, [arbitroId]);
        console.log("Partidos obtenidos:", results);
        res.json(results);
    } catch (error) {
        console.error("Error al obtener los partidos:", error);
        res.status(500).json({ error: "Error al obtener los partidos" });
    }
});

// filtrar por federados y escolares en funcion del mes y año 
router.get('/federados/:arbitroId/:mes/:year', async (req, res) => {
    const { arbitroId, mes, year } = req.params;

    try {
        // Mapeo de meses en español a números
        const meses = {
            Enero: 1,
            Febrero: 2,
            Marzo: 3,
            Abril: 4,
            Mayo: 5,
            Junio: 6,
            Julio: 7,
            Agosto: 8,
            Septiembre: 9,
            Octubre: 10,
            Noviembre: 11,
            Diciembre: 12,
        };

        const monthNumber = meses[mes];
        if (!monthNumber) throw new Error(`Mes no válido: ${mes}`);

        const query = `
            SELECT
                p.dia,
                p.hora,
                c.nombre AS categoria,
                ea.nombre AS equipoA,
                eb.nombre AS equipoB,
                pa.dieta,
                pa.desplazamiento,
                (pa.dieta + pa.desplazamiento) AS total,
                t.importe,
                f.nombre AS funcion
            FROM partidos p
            JOIN categorias c ON p.categoria_id = c.id
            JOIN equipos ea ON p.equipo_a_id = ea.id
            JOIN equipos eb ON p.equipo_b_id = eb.id
            JOIN partidos_arbitros pa ON p.id = pa.partido_id
            JOIN funciones f ON pa.funcion_id = f.id
            JOIN tarifas t ON p.categoria_id = t.categoria_id AND pa.funcion_id = t.funcion_id
            WHERE pa.arbitro_id = ?
              AND MONTH(p.dia) = ?
              AND YEAR(p.dia) = ?
              AND c.padre = 37
              AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR;
        `;

        const [results] = await db.query(query, [arbitroId, monthNumber, year]);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener partidos federados:', error);
        res.status(500).json({ error: 'Error al obtener los partidos federados' });
    }
});

router.get('/escolares/:arbitroId/:mes/:year', async (req, res) => {
    const { arbitroId, mes, year } = req.params;

    try {
        const meses = {
            Enero: 1,
            Febrero: 2,
            Marzo: 3,
            Abril: 4,
            Mayo: 5,
            Junio: 6,
            Julio: 7,
            Agosto: 8,
            Septiembre: 9,
            Octubre: 10,
            Noviembre: 11,
            Diciembre: 12,
        };

        const monthNumber = meses[mes];
        if (!monthNumber) throw new Error(`Mes no válido: ${mes}`);

        const query = `
            WITH RECURSIVE categorias_escolares AS (
                SELECT id, padre
                FROM categorias
                WHERE id = 36
                UNION ALL
                SELECT c.id, c.padre
                FROM categorias c
                INNER JOIN categorias_escolares ce ON c.padre = ce.id
            )
            SELECT DISTINCT
                p.id AS partido_id,
                p.dia,
                p.hora,
                c.nombre AS categoria,
                ea.nombre AS equipoA,
                eb.nombre AS equipoB,
                pa.dieta,
                pa.desplazamiento,
                (pa.dieta + pa.desplazamiento) AS total,
                (
                    SELECT t.importe
                    FROM tarifas t
                    WHERE t.categoria_id IN (
                        SELECT id FROM categorias_escolares
                    )
                    AND t.funcion_id = pa.funcion_id
                    LIMIT 1
                ) AS importe,
                f.nombre AS funcion
            FROM partidos p
            JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN equipos ea ON p.equipo_a_id = ea.id
            LEFT JOIN equipos eb ON p.equipo_b_id = eb.id
            JOIN partidos_arbitros pa ON p.id = pa.partido_id
            JOIN funciones f ON pa.funcion_id = f.id
            WHERE pa.arbitro_id = ?
              AND MONTH(p.dia) = ?
              AND YEAR(p.dia) = ?
              AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR
              AND p.categoria_id IN (
                  SELECT id FROM categorias_escolares
              );
        `;

        const [results] = await db.query(query, [arbitroId, monthNumber, year]);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener partidos escolares:', error);
        res.status(500).json({ error: 'Error al obtener los partidos escolares' });
    }
});

module.exports = router;
