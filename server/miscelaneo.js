const express = require('express');
const router = express.Router();
const db = require('./db_setup');

// GET - Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, CAST(importe AS DECIMAL(10, 2)) AS importe FROM miscelaneo'
        );
        console.log('Datos recuperados del backend:', rows); // Asegúrate de que `id` aparece en los resultados
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener datos de misceláneo:', error);
        res.status(500).json({ success: false, message: 'Error al obtener datos' });
    }
});

// POST - Insertar un nuevo registro
router.post('/', async (req, res) => {
    const { nombre, importe } = req.body;

    // Validar que los campos están presentes
    if (!nombre || importe === undefined || importe === null) {
        return res.status(400).json({ success: false, message: 'Los campos nombre e importe son obligatorios.' });
    }

    try {
        // Insertar el nuevo registro en la base de datos
        const [result] = await db.query(
            'INSERT INTO miscelaneo (nombre, importe) VALUES (?, ?)',
            [nombre, parseFloat(importe)]
        );

        console.log('Registro insertado:', { id: result.insertId, nombre, importe });

        res.json({
            success: true,
            message: 'Ítem creado con éxito.',
            data: { id: result.insertId, nombre, importe: parseFloat(importe) }
        });
    } catch (error) {
        console.error('Error al insertar datos en misceláneo:', error);
        res.status(500).json({ success: false, message: 'Error al insertar datos.' });
    }
});

// PUT - Actualizar un registro existente
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del parámetro de la URL
    const { nombre, importe } = req.body; // Obtener los datos del cuerpo de la solicitud

    // Validar que los campos están presentes
    if (!nombre || importe === undefined || importe === null) {
        return res.status(400).json({ success: false, message: 'Los campos nombre e importe son obligatorios.' });
    }

    try {
        // Actualizar el registro en la base de datos
        const [result] = await db.query(
            'UPDATE miscelaneo SET nombre = ?, importe = ? WHERE id = ?',
            [nombre, parseFloat(importe), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Ítem no encontrado.' });
        }

        console.log('Registro actualizado:', { id, nombre, importe });

        res.json({
            success: true,
            message: 'Ítem actualizado con éxito.',
            data: { id, nombre, importe: parseFloat(importe) }
        });
    } catch (error) {
        console.error('Error al actualizar datos en misceláneo:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar datos.' });
    }
});

// DELETE - Eliminar múltiples registros por ID
router.delete('/', async (req, res) => {
    const { ids } = req.body; // Recibir los IDs desde el cuerpo de la solicitud

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Se debe proporcionar una lista de IDs para eliminar.' });
    }

    try {
        // Eliminar los registros que coincidan con los IDs proporcionados
        const [result] = await db.query('DELETE FROM miscelaneo WHERE id IN (?)', [ids]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ítems para eliminar.' });
        }

        console.log('Registros eliminados:', ids);

        res.json({
            success: true,
            message: 'Ítem(s) eliminado(s) con éxito.',
        });
    } catch (error) {
        console.error('Error al eliminar datos en misceláneo:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar datos.' });
    }
});

module.exports = router;
