const express = require('express');
const router = express.Router();
const db = require('./db_setup');

const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer();

const { getCategoriaId, getEquipoId, getCampoId, getArbitroId } = require('./dbHelpers');

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
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { resultado_a, resultado_b } = req.body;

//     console.log("Valores recibidos:", { id, resultado_a, resultado_b }); // Verifica los valores

//     if (resultado_a === undefined || resultado_b === undefined) {
//         return res.status(400).json({ error: "Faltan valores para resultado_a y resultado_b" });
//     }

//     try {
//         const query = `
//             UPDATE partidos
//             SET resultado_a = ?, resultado_b = ?
//             WHERE id = ?;
//         `;

//         const [result] = await db.query(query, [resultado_a, resultado_b, id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Partido no encontrado" });
//         }

//         res.json({ message: "Resultados actualizados correctamente" });
//     } catch (error) {
//         console.error("Error al actualizar resultados:", error);
//         res.status(500).json({ error: "Error al actualizar resultados" });
//     }
// });

// Actualizar datos del partido
router.put('/:id', async (req, res) => {
    const { id } = req.params; // ID del partido desde la URL
    const { dia, hora, categoria_id, equipo_local_id, equipo_visitante_id, campo_id, resultado_a, resultado_b } = req.body;

    // Validar que al menos un campo exista
    if (!id || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No hay datos para actualizar o falta el ID del partido" });
    }

    try {
        // Construir la consulta dinámica
        const campos = [];
        const valores = [];

        if (dia) {
            campos.push('dia = ?');
            valores.push(dia);
        }
        if (hora) {
            campos.push('hora = ?');
            valores.push(hora);
        }
        if (categoria_id) {
            campos.push('categoria_id = ?');
            valores.push(categoria_id);
        }
        if (equipo_local_id) {
            campos.push('equipo_a_id = ?');
            valores.push(equipo_local_id);
        }
        if (equipo_visitante_id) {
            campos.push('equipo_b_id = ?');
            valores.push(equipo_visitante_id);
        }
        if (campo_id) {
            campos.push('campo_id = ?');
            valores.push(campo_id);
        }
        if (resultado_a !== undefined) {
            campos.push('resultado_a = ?');
            valores.push(resultado_a);
        }
        if (resultado_b !== undefined) {
            campos.push('resultado_b = ?');
            valores.push(resultado_b);
        }

        // Si no hay campos válidos, devolver error
        if (campos.length === 0) {
            return res.status(400).json({ error: "No hay campos válidos para actualizar" });
        }

        valores.push(id); // Agregar el ID al final

        const query = `
            UPDATE partidos
            SET ${campos.join(', ')}
            WHERE id = ?;
        `;

        const [result] = await db.query(query, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Partido no encontrado" });
        }

        res.json({ message: "Partido actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el partido:", error);
        res.status(500).json({ error: "Error al actualizar el partido" });
    }
});


// router.get('/:partidoId/detalles', async (req, res) => {
//     const { partidoId } = req.params;

//     try {
//         const query = `
//             SELECT
//                 CONCAT(DATE_FORMAT(p.dia, '%d/%m/%Y'), ' ', TIME_FORMAT(p.hora, '%H:%i')) AS fecha_encuentro,
//                 c.nombre AS categoria,
//                 ea.nombre AS equipo_local,
//                 eb.nombre AS equipo_visitante,
//                 COALESCE(ca.nombre, 'Sin campo asignado') AS campo,
//                 COALESCE(MAX(ae.alias), 'Sin técnico asignado') AS tecnico,
//                 COALESCE(DATE_FORMAT(MAX(i.fecha), '%d/%m/%Y'), 'Sin fecha') AS fecha_informe,
//                 JSON_ARRAYAGG(
//                     JSON_OBJECT(
//                         'id', ar.id,
//                         'alias', ar.alias,
//                         'nombre', ar.nombre,
//                         'apellido', ar.apellido,
//                         'funcion', f.nombre,
//                         'telefono', ar.telefono,
//                         'imagen', i.imagen,
//                         'mecanica', i.mecanica,
//                         'criterio', i.criterio,
//                         'control_partido', i.control_partido,
//                         'valoracion', i.valoracion
//                     )
//                 ) AS arbitros
//             FROM partidos p
//             LEFT JOIN categorias c ON p.categoria_id = c.id
//             LEFT JOIN equipos ea ON p.equipo_a_id = ea.id
//             LEFT JOIN equipos eb ON p.equipo_b_id = eb.id
//             LEFT JOIN campos ca ON p.campo_id = ca.id
//             LEFT JOIN partidos_arbitros pa ON p.id = pa.partido_id
//             LEFT JOIN arbitros ar ON pa.arbitro_id = ar.id -- Aquí se define 'ar'
//             LEFT JOIN informes i ON p.id = i.partido_id AND ar.id = i.arbitro_id -- Ahora 'ar.id' es válido
//             LEFT JOIN arbitros ae ON i.evaluador_id = ae.id
//             LEFT JOIN funciones f ON pa.funcion_id = f.id
//             WHERE p.id = ?
//             GROUP BY p.id, c.nombre, ea.nombre, eb.nombre, ca.nombre;
//         `;

//         const [result] = await db.query(query, [partidoId]);

//         if (result.length === 0) {
//             return res.status(404).json({ error: "Partido no encontrado" });
//         }

//         res.json(result[0]);
//     } catch (error) {
//         console.error("Error al obtener los detalles del partido:", error);
//         res.status(500).json({ error: "Error al obtener los detalles del partido" });
//     }
// });

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
                COALESCE(DATE_FORMAT(MAX(i.fecha), '%d/%m/%Y'), 'Sin fecha') AS fecha_informe,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', ar.id,
                        'alias', ar.alias,
                        'nombre', ar.nombre,
                        'apellido', ar.apellido,
                        'funcion', f.nombre,
                        'telefono', ar.telefono,
                        'imagen', i.imagen,
                        'mecanica', i.mecanica,
                        'criterio', i.criterio,
                        'control_partido', i.control_partido,
                        'valoracion', i.valoracion
                    )
                ) AS arbitros,
                MAX(pa.dieta) AS dieta -- Aquí obtenemos el estado global de dieta
            FROM partidos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN equipos ea ON p.equipo_a_id = ea.id
            LEFT JOIN equipos eb ON p.equipo_b_id = eb.id
            LEFT JOIN campos ca ON p.campo_id = ca.id
            LEFT JOIN partidos_arbitros pa ON p.id = pa.partido_id
            LEFT JOIN arbitros ar ON pa.arbitro_id = ar.id -- Aquí se define 'ar'
            LEFT JOIN informes i ON p.id = i.partido_id AND ar.id = i.arbitro_id -- Ahora 'ar.id' es válido
            LEFT JOIN arbitros ae ON i.evaluador_id = ae.id
            LEFT JOIN funciones f ON pa.funcion_id = f.id
            WHERE p.id = ?
            GROUP BY p.id, c.nombre, ea.nombre, eb.nombre, ca.nombre;
        `;

        const [result] = await db.query(query, [partidoId]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Partido no encontrado" });
        }

        res.json(result[0]); // Devolver el resultado con el estado de dieta incluido
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
// router.get('/federados/:arbitroId/:mes/:year', async (req, res) => {
//     const { arbitroId, mes, year } = req.params;

//     try {
//         // Mapeo de meses en español a números
//         const meses = {
//             Enero: 1,
//             Febrero: 2,
//             Marzo: 3,
//             Abril: 4,
//             Mayo: 5,
//             Junio: 6,
//             Julio: 7,
//             Agosto: 8,
//             Septiembre: 9,
//             Octubre: 10,
//             Noviembre: 11,
//             Diciembre: 12,
//         };

//         const monthNumber = meses[mes];
//         if (!monthNumber) throw new Error(`Mes no válido: ${mes}`);

//         const query = `
//             SELECT
//                 p.dia,
//                 p.hora,
//                 c.nombre AS categoria,
//                 ea.nombre AS equipoA,
//                 eb.nombre AS equipoB,
//                 pa.dieta,
//                 pa.desplazamiento,
//                 (pa.dieta + pa.desplazamiento) AS total,
//                 t.importe,
//                 f.nombre AS funcion
//             FROM partidos p
//             JOIN categorias c ON p.categoria_id = c.id
//             JOIN equipos ea ON p.equipo_a_id = ea.id
//             JOIN equipos eb ON p.equipo_b_id = eb.id
//             JOIN partidos_arbitros pa ON p.id = pa.partido_id
//             JOIN funciones f ON pa.funcion_id = f.id
//             JOIN tarifas t ON p.categoria_id = t.categoria_id AND pa.funcion_id = t.funcion_id
//             WHERE pa.arbitro_id = ?
//               AND MONTH(p.dia) = ?
//               AND YEAR(p.dia) = ?
//               AND c.padre = 37
//               AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR;
//         `;

//         const [results] = await db.query(query, [arbitroId, monthNumber, year]);
//         res.json(results);
//     } catch (error) {
//         console.error('Error al obtener partidos federados:', error);
//         res.status(500).json({ error: 'Error al obtener los partidos federados' });
//     }
// });

router.get('/federados/:arbitroId/:mes/:year', async (req, res) => {
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
            SELECT
                p.dia,
                p.hora,
                c.nombre AS categoria,
                ea.nombre AS equipoA,
                eb.nombre AS equipoB,
                pa.dieta,
                pa.desplazamiento,
                IF(pa.dieta = 1, m.importe, 0) AS dietas,
                (pa.desplazamiento + IF(pa.dieta = 1, m.importe, 0)) AS total,
                t.importe,
                f.nombre AS funcion
            FROM partidos p
            JOIN categorias c ON p.categoria_id = c.id
            JOIN equipos ea ON p.equipo_a_id = ea.id
            JOIN equipos eb ON p.equipo_b_id = eb.id
            JOIN partidos_arbitros pa ON p.id = pa.partido_id
            JOIN funciones f ON pa.funcion_id = f.id
            JOIN tarifas t ON p.categoria_id = t.categoria_id AND pa.funcion_id = t.funcion_id
            LEFT JOIN miscelaneo m ON m.id = 4
            WHERE pa.arbitro_id = ?
              AND MONTH(p.dia) = ?
              AND YEAR(p.dia) = ?
              AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR
              AND c.padre = 37;
        `;

        const [results] = await db.query(query, [arbitroId, monthNumber, year]);
        console.log('Resultados de la consulta:', results); // Añade este log
        res.json(results);
    } catch (error) {
        console.error('Error al obtener partidos federados:', error);
        res.status(500).json({ error: 'Error al obtener los partidos federados' });
    }
});


// router.get('/escolares/:arbitroId/:mes/:year', async (req, res) => {
//     const { arbitroId, mes, year } = req.params;

//     try {
//         const meses = {
//             Enero: 1,
//             Febrero: 2,
//             Marzo: 3,
//             Abril: 4,
//             Mayo: 5,
//             Junio: 6,
//             Julio: 7,
//             Agosto: 8,
//             Septiembre: 9,
//             Octubre: 10,
//             Noviembre: 11,
//             Diciembre: 12,
//         };

//         const monthNumber = meses[mes];
//         if (!monthNumber) throw new Error(`Mes no válido: ${mes}`);

//         const query = `
//             WITH RECURSIVE categorias_escolares AS (
//                 SELECT id, padre
//                 FROM categorias
//                 WHERE id = 36
//                 UNION ALL
//                 SELECT c.id, c.padre
//                 FROM categorias c
//                 INNER JOIN categorias_escolares ce ON c.padre = ce.id
//             )
//             SELECT DISTINCT
//                 p.id AS partido_id,
//                 p.dia,
//                 p.hora,
//                 c.nombre AS categoria,
//                 ea.nombre AS equipoA,
//                 eb.nombre AS equipoB,
//                 pa.dieta,
//                 pa.desplazamiento,
//                 (pa.dieta + pa.desplazamiento) AS total,
//                 (
//                     SELECT t.importe
//                     FROM tarifas t
//                     WHERE t.categoria_id IN (
//                         SELECT id FROM categorias_escolares
//                     )
//                     AND t.funcion_id = pa.funcion_id
//                     LIMIT 1
//                 ) AS importe,
//                 f.nombre AS funcion
//             FROM partidos p
//             JOIN categorias c ON p.categoria_id = c.id
//             LEFT JOIN equipos ea ON p.equipo_a_id = ea.id
//             LEFT JOIN equipos eb ON p.equipo_b_id = eb.id
//             JOIN partidos_arbitros pa ON p.id = pa.partido_id
//             JOIN funciones f ON pa.funcion_id = f.id
//             WHERE pa.arbitro_id = ?
//               AND MONTH(p.dia) = ?
//               AND YEAR(p.dia) = ?
//               AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR
//               AND p.categoria_id IN (
//                   SELECT id FROM categorias_escolares
//               );
//         `;

//         const [results] = await db.query(query, [arbitroId, monthNumber, year]);
//         res.json(results);
//     } catch (error) {
//         console.error('Error al obtener partidos escolares:', error);
//         res.status(500).json({ error: 'Error al obtener los partidos escolares' });
//     }
// });

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
                IF(pa.dieta = 1, m.importe, 0) AS dietas, -- Obtener el importe de la tabla miscelaneo si dieta = 1
                (pa.desplazamiento + IF(pa.dieta = 1, m.importe, 0)) AS total,
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
            LEFT JOIN miscelaneo m ON m.id = 4 -- Usar la entrada específica de dietas (id=4)
            WHERE pa.arbitro_id = ?
              AND MONTH(p.dia) = ?
              AND YEAR(p.dia) = ?
              AND TIMESTAMP(p.dia, p.hora) <= NOW() - INTERVAL 3 HOUR
              AND p.categoria_id IN (
                  SELECT id FROM categorias_escolares
              );
        `;

        const [results] = await db.query(query, [arbitroId, monthNumber, year]);
        console.log('Resultados de partidos escolares:', results); // Log para verificar datos
        res.json(results);
    } catch (error) {
        console.error('Error al obtener partidos escolares:', error);
        res.status(500).json({ error: 'Error al obtener los partidos escolares' });
    }
});


router.put('/:partidoId/dieta', async (req, res) => {
    const { partidoId } = req.params;
    const { dieta } = req.body;

    if (typeof dieta !== 'number') {
        return res.status(400).json({ error: 'Dieta debe ser un número (0 o 1)' });
    }

    try {
        const query = `
            UPDATE partidos_arbitros
            SET dieta = ?
            WHERE partido_id = ?
        `;
        const [result] = await db.query(query, [dieta, partidoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Partido no encontrado o sin árbitros asociados' });
        }

        res.json({ message: 'Dieta actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar dieta:', error);
        res.status(500).json({ error: 'Error al actualizar dieta' });
    }
});

// Función para normalizar encabezados
// Normalizar encabezados y datos
const normalizeHeaders = (sheet) => {
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const [headers, ...rows] = data;

    if (!headers) throw new Error("El archivo Excel no tiene encabezados.");

    // Normalizar encabezados
    const normalizedHeaders = headers.map(header =>
        header?.trim().toLowerCase().replace(/\s+/g, "_").replace(/"/g, "") || ""
    );

    console.log("Encabezados normalizados:", normalizedHeaders);

    // Crear datos normalizados
    return rows.map(row => {
        // Si la fila tiene menos columnas, completa con valores nulos
        const fullRow = Array.from({ length: normalizedHeaders.length }, (_, i) => row[i] || null);
        return Object.fromEntries(normalizedHeaders.map((header, i) => [header, fullRow[i]]));
    });
};

const excelToTime = (excelHour) => {
    if (!excelHour) return '00:00:00'; // Manejar valores nulos o vacíos
    const totalSeconds = Math.round(excelHour * 86400); // Convertir a segundos del día
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => String(v).padStart(2, '0')).join(':');
};

// Endpoint para importar archivo Excel
// Endpoint para importar el archivo Excel
router.post("/importar", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No se proporcionó ningún archivo." });
        }

        // Leer el archivo Excel
        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Normalizar datos del Excel
        const data = normalizeHeaders(sheet);
        console.log("Contenido del Excel normalizado:", data);

        // Procesar cada fila
        for (const row of data) {
            const {
                categoria,
                local,
                visitante,
                hora,
                fecha,
                campo,
                arbitro_principal,
                arbitro_auxiliar,
                anotador,
                cronometrador,
                operador_24,
                ayudante_anotador
            } = row;

            if (!categoria || !local || !visitante || !hora || !fecha || !campo) {
                console.warn("Fila incompleta, omitiendo:", row);
                continue;
            }

            try {
                // Obtener IDs de la base de datos
                const categoriaId = await getCategoriaId(categoria);
                const equipoLocalId = await getEquipoId(local, categoriaId);
                const equipoVisitanteId = await getEquipoId(visitante, categoriaId);
                const campoId = await getCampoId(campo);

                // Insertar partido
                const partidoId = await insertarPartido({
                    dia: formatDate(fecha),
                    hora: excelToTime(hora), // Convertir la hora
                    categoria_id: categoriaId,
                    equipo_a_id: equipoLocalId,
                    equipo_b_id: equipoVisitanteId,
                    campo_id: campoId,
                });

                // Insertar árbitros en la tabla partidos_arbitros
                await insertarArbitros(partidoId, {
                    "Arbitro Principal": arbitro_principal,
                    "Arbitro Auxiliar": arbitro_auxiliar,
                    "Anotador": anotador,
                    "Cronometrador": cronometrador,
                    "Operador 24\"": operador_24,
                    "Ayudante Anotador": ayudante_anotador,
                });

                console.log(`Partido insertado correctamente con ID: ${partidoId}`);
            } catch (error) {
                console.error("Error al procesar la fila:", row, error.message);
            }
        }

        res.json({ success: true, message: "Archivo procesado exitosamente" });
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        res.status(500).json({ error: "Error al procesar el archivo." });
    }
});

// Función para insertar un partido
async function insertarPartido(data) {
    const query = `
        INSERT INTO partidos (dia, hora, categoria_id, equipo_a_id, equipo_b_id, campo_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
        data.dia, data.hora, data.categoria_id, data.equipo_a_id, data.equipo_b_id, data.campo_id,
    ]);
    return result.insertId;
}

// Función para insertar árbitros en la tabla partidos_arbitros
async function insertarArbitros(partidoId, arbitros) {
    const funciones = [
        { columna: "Arbitro Principal", funcion: "Principal" },
        { columna: "Arbitro Auxiliar", funcion: "Auxiliar 1" },
        { columna: "Anotador", funcion: "Anotador" },
        { columna: "Cronometrador", funcion: "Cronometrador" },
        { columna: "Operador 24\"", funcion: "24 segundos" },
        { columna: "Ayudante Anotador", funcion: "Ayudante de Anotador" },
    ];

    for (const { columna, funcion } of funciones) {
        const alias = arbitros[columna];
        if (alias) {
            try {
                const arbitroId = await getArbitroId(alias);
                const [funcionRow] = await db.query("SELECT id FROM funciones WHERE nombre = ?", [funcion]);
                if (funcionRow.length === 0) {
                    console.error(`Función no encontrada: ${funcion}`);
                    continue;
                }
                await db.query(`
                    INSERT INTO partidos_arbitros (partido_id, arbitro_id, funcion_id, dieta, desplazamiento)
                    VALUES (?, ?, ?, 0, 0)
                `, [partidoId, arbitroId, funcionRow[0].id]);
            } catch (error) {
                console.error(`Error al insertar árbitro (${alias}) con función (${funcion}):`, error.message);
            }
        }
    }
}

// Función para formatear fechas
const formatDate = (fecha) => {
    if (!fecha) return null;

    if (typeof fecha === "string") {
        // Caso: fecha en formato "DD/MM/YYYY"
        const [day, month, year] = fecha.split("/");
        return `${year}-${month}-${day}`; // Convertir a "YYYY-MM-DD"
    }

    if (typeof fecha === "number") {
        // Caso: fecha como número (formato Excel)
        const excelDate = new Date((fecha - 25569) * 86400 * 1000);
        return excelDate.toISOString().split("T")[0]; // Convertir a "YYYY-MM-DD"
    }

    return null;
};

module.exports = router;
