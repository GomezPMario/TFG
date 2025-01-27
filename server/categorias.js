const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// Obtener todas las categorías con su categoría raíz calculada
router.get('/', async (req, res) => {
    try {
        const query = `
            WITH RECURSIVE CategoriaRaiz AS (
                SELECT 
                    id, 
                    nombre, 
                    padre, 
                    nombre AS categoria_raiz
                FROM categorias
                WHERE padre IS NULL
                UNION ALL
                SELECT 
                    c.id, 
                    c.nombre, 
                    c.padre, 
                    cr.categoria_raiz
                FROM categorias c
                INNER JOIN CategoriaRaiz cr ON c.padre = cr.id
            )
            SELECT 
                c.id,
                c.nombre,
                c.padre,  
                CASE 
                    WHEN cr.categoria_raiz = 'ESCOLARES' THEN 'ESCOLAR'
                    WHEN cr.categoria_raiz = 'FEDERADOS' THEN 'FEDERADO'
                    ELSE cr.categoria_raiz
                END AS categoria_raiz,
                p.nombre AS nombre_padre -- Columna adicional para el nombre del padre
            FROM CategoriaRaiz cr
            INNER JOIN categorias c ON c.id = cr.id
            LEFT JOIN categorias p ON c.padre = p.id -- Join para obtener el nombre del padre
            WHERE c.padre IS NOT NULL 
              AND c.id NOT IN (63, 64, 65);
        `;

        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
});


// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                c2.nombre AS nombre_padre
            FROM 
                categorias c1
            LEFT JOIN 
                categorias c2
            ON 
                c1.padre = c2.id
            WHERE 
                c1.id = ?`;
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }

        res.status(200).json(rows[0]); // Devuelve solo el nombre del padre
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ error: 'Error al obtener la categoría.' });
    }
});

// Obtener subcategorías por ID del padre
router.get('/subcategorias/:padre', async (req, res) => {
    const { padre } = req.params;
    try {
        const query = `
            SELECT id, nombre 
            FROM categorias 
            WHERE padre = ?`;
        const [rows] = await db.query(query, [padre]);
        console.log("Subcategorías para padre:", rows); // Log para verificar subcategorías
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        res.status(500).json({ error: 'Error al obtener subcategorías.' });
    }
});



// Crear una nueva categoría
router.post('/', async (req, res) => {
    const { nombre, padre } = req.body;

    if (!nombre || !padre) {
        return res.status(400).json({ error: 'El nombre y el padre son obligatorios.' });
    }

    try {
        const query = 'INSERT INTO categorias (nombre, padre) VALUES (?, ?)';
        const [result] = await db.query(query, [nombre, padre]);
        const newCategoria = { id: result.insertId, nombre, padre };
        res.status(201).json(newCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
});

// Actualizar categorías
router.put('/', async (req, res) => {
    const categorias = req.body;

    if (!Array.isArray(categorias) || categorias.length === 0) {
        return res.status(400).json({ error: 'Se requiere una lista de categorías para actualizar.' });
    }

    try {
        const promises = categorias.map(({ id, nombre, padre }) => {
            if (!id || !nombre) {
                return Promise.resolve(); // No procesar si los valores no son válidos
            }
            const query = 'UPDATE categorias SET nombre = ?, padre = ? WHERE id = ?';
            return db.query(query, [nombre, padre || null, id]);
        });

        await Promise.all(promises);
        res.status(200).json({ message: 'Categorías actualizadas con éxito.' });
    } catch (error) {
        console.error('Error al actualizar las categorías:', error);
        res.status(500).json({ error: 'Error al actualizar las categorías.' });
    }
});


// Eliminar categorías
router.delete('/', async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Se requiere una lista de IDs para eliminar.' });
    }

    try {
        const query = 'DELETE FROM categorias WHERE id IN (?)';
        await db.query(query, [ids]);
        res.status(200).json({ message: 'Categorías eliminadas con éxito.' });
    } catch (error) {
        console.error('Error al eliminar las categorías:', error);
        res.status(500).json({ error: 'Error al eliminar las categorías.' });
    }
});

module.exports = router;
