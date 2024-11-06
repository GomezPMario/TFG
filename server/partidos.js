const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// Ruta para obtener los partidos por árbitro con compañeros
router.get('/partidos/:arbitroId', async (req, res) => {
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
                f.nombre AS mi_funcion,           -- La función del árbitro principal
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'arbitro_id', ac.id,
                        'numero_colegiado', ac.numero_colegiado,
                        'nombre', ac.nombre,
                        'apellido', ac.apellido,
                        'alias', ac.alias,
                        'telefono', ac.telefono,
                        'funcion', cf.nombre         -- La función de cada compañero
                    )
                ) AS companeros
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

        // const [results] = await db.query(query, [arbitroId, arbitroId]);
        const [results] = await db.query(query, [arbitroId]);
        console.log("Partidos obtenidos:", results);
        res.json(results);
    } catch (error) {
        console.error("Error al obtener los partidos:", error);
        res.status(500).json({ error: "Error al obtener los partidos" });
    }
});

const upload = multer({ dest: 'uploads/' });

router.post('/importar', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);

        for (let row of rows) {
            const { categoria, equipoLocal, equipoVisitante, dia, hora, autobus, anotaciones } = row;

            // 1. Insertar categoría si no existe
            const [catResult] = await db.query('SELECT id FROM categorias WHERE nombre = ?', [categoria]);
            let categoriaId = catResult.length ? catResult[0].id : null;
            if (!categoriaId) {
                const [insertCat] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [categoria]);
                categoriaId = insertCat.insertId;
            }

            // 2. Insertar equipos si no existen
            const getOrInsertEquipo = async (equipoNombre) => {
                const [equipoResult] = await db.query('SELECT id FROM equipos WHERE nombre = ?', [equipoNombre]);
                if (equipoResult.length) return equipoResult[0].id;
                const [insertEquipo] = await db.query('INSERT INTO equipos (nombre, categoria_id) VALUES (?, ?)', [equipoNombre, categoriaId]);
                return insertEquipo.insertId;
            };
            const equipoAId = await getOrInsertEquipo(equipoLocal);
            const equipoBId = await getOrInsertEquipo(equipoVisitante);

            // 3. Insertar partido
            await db.query(
                'INSERT INTO partidos (dia, hora, categoria_id, equipo_a_id, equipo_b_id, autobus, anotaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [dia, hora, categoriaId, equipoAId, equipoBId, autobus, anotaciones]
            );
        }

        res.json({ message: "Archivo importado exitosamente" });
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        res.status(500).json({ error: "Error al procesar el archivo" });
    }
});


module.exports = router;
