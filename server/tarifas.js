// tarifas.js
const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// Ruta para obtener tarifas por categoría y función en una sola línea por categoría
router.get('/tarifas', async (req, res) => {
    const query = `
        SELECT 
            c.nombre AS categoria,
            MAX(CASE WHEN f.nombre = 'Principal' THEN t.importe ELSE NULL END) AS Principal,
            MAX(CASE WHEN f.nombre = 'Auxiliar 1' THEN t.importe ELSE NULL END) AS Auxiliar_1,
            MAX(CASE WHEN f.nombre = 'Auxiliar 2' THEN t.importe ELSE NULL END) AS Auxiliar_2,
            MAX(CASE WHEN f.nombre = 'Anotador' THEN t.importe ELSE NULL END) AS Anotador,
            MAX(CASE WHEN f.nombre = 'Cronometrador' THEN t.importe ELSE NULL END) AS Cronometrador,
            MAX(CASE WHEN f.nombre = '24 segundos' THEN t.importe ELSE NULL END) AS Veinticuatro_Segundos,
            MAX(CASE WHEN f.nombre = 'Ayudante de Anotador' THEN t.importe ELSE NULL END) AS Ayudante_Anotador,
            MAX(CASE WHEN f.nombre = 'Canon FAB' THEN t.importe ELSE NULL END) AS Canon_FAB,
            -- Calcula el total sumando todas las funciones
            COALESCE(MAX(CASE WHEN f.nombre = 'Principal' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Auxiliar 1' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Auxiliar 2' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Anotador' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Cronometrador' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = '24 segundos' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Ayudante de Anotador' THEN t.importe ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN f.nombre = 'Canon FAB' THEN t.importe ELSE 0 END), 0) AS Total
        FROM tarifas t
        JOIN categorias c ON t.categoria_id = c.id
        JOIN funciones f ON t.funcion_id = f.id
        GROUP BY c.nombre
        ORDER BY FIELD(c.nombre, 
            'ACB',
            'LIGA FEM',
            '2ª FEB',
            'LIGA FEM 2',
            '3ª FEB',
            'COPA ESPAÑA',
            'SILLA RUEDAS (1ª DIV)',
            '1ª MASC A1',
            'COPA 1ª MASC',
            '1ª MASC A2',
            '1ª FEM A1 (Liga Regular)',
            '1ª FEM A1 (Semis y Final)',
            'COPA 1ª FEM',
            '1ª FEM A2',
            '2ª ARAG MASC',
            '2ª ARAG FEM',
            '3ª ARAG MASC',
            '3ª ARAG FEM',
            'LIGA SOCIAL',
            'CTO. ARAGÓN JUNIOR MASC 1ª',
            'CTO. ARAGÓN JUNIOR FEM 1ª',
            'CTO. ARAGÓN JUNIOR MASC 2ª',
            'CTO. ARAGÓN JUNIOR FEM 2ª',
            'CTO. ARAGÓN JUNIOR MASC 3ª',
            'CTO. ARAGÓN JUNIOR FEM 3ª',
            'FINALES CTO. ARAGÓN ESCOLAR',
            'CATEG. INFERIORES',
            'ESCUELA',
            '3x3 SENIOR (cada 20 min)',
            '3x3 JUNIOR (cada 20 min)',
            '3x3 ESCOLAR (cada 20 min)',
            '3x3 SENIOR (cada 25 min)',
            '3x3 JUNIOR (cada 25 min)',
            '3x3 ESCOLAR (cada 25 min)'
        );
    `;

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener tarifas:', error.message);
        res.status(500).json({ error: 'Error al obtener tarifas', details: error.message });
    }
});

module.exports = router;
