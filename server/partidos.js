const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// Ruta para obtener los partidos por árbitro
router.get('/partidos/:arbitroId', async (req, res) => {
    const arbitroId = req.params.arbitroId;

    try {
        const query = `
            SELECT 
                p.id AS partido_id,
                p.dia, 
                p.hora, 
                f.nombre AS funcion,        
                c.nombre AS categoria,      
                ea.nombre AS equipoA,       
                eb.nombre AS equipoB,       
                p.ubicacion AS campo, 
                p.autobus AS autobus, 
                p.anotaciones AS notas
            FROM partidos p
            JOIN partidos_arbitros pa ON p.id = pa.partido_id
            JOIN funciones f ON p.funcion_id = f.id          
            JOIN categorias c ON p.categoria_id = c.id       
            JOIN equipos ea ON p.equipo_a_id = ea.id         
            JOIN equipos eb ON p.equipo_b_id = eb.id         
            WHERE pa.arbitro_id = ?                           
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
