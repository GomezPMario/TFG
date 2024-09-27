const express = require('express');
const db = require('./db_setup'); // Asegúrate de que la conexión a la base de datos está bien configurada
const router = express.Router();

// Endpoint para actualizar el perfil del árbitro
router.put('/updatePerfil/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del árbitro de la URL
    const { nombre, apellido, domicilio, telefono, email, cuenta, username, password, permiso, categoria, subcategoria, numeroColegiado } = req.body; // Campos que se pueden actualizar

    try {
        // Consulta para obtener los datos del árbitro y su permiso
        const [rows] = await db.query('SELECT permiso FROM arbitros WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Árbitro no encontrado' });
        }

        const currentPermiso = rows[0].permiso;

        // Verifica el permiso del árbitro
        if (currentPermiso === '1') {
            // Si es admin, puede actualizar todos los campos
            await db.query(
                `UPDATE arbitros SET username = ?, password = ?, nombre = ?, apellido = ?, domicilio = ?, telefono = ?, email = ?, cuenta = ?, permiso = ?, categoria = ?, subcategoria = ?, numeroColegiado = ? WHERE id = ?`,
                [username, password, nombre, apellido, domicilio, telefono, email, cuenta, permiso, categoria, subcategoria, numeroColegiado, id]
            );
        } else if (currentPermiso === '2' || currentPermiso === '3') {
            // Si es técnico o árbitro, no puede actualizar ciertos campos
            await db.query(
                `UPDATE arbitros SET nombre = ?, apellido = ?, domicilio = ?, telefono = ?, email = ? WHERE id = ?`,
                [nombre, apellido, domicilio, telefono, email, id]
            );

            // Si tiene permiso 2 o 3, permite actualizar el número de colegiado
            if (currentPermiso === '3') {
                await db.query(
                    `UPDATE arbitros SET numeroColegiado = ? WHERE id = ?`,
                    [numeroColegiado, id]
                );
            }
        } else {
            return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
        }

        res.json({ success: true, message: 'Perfil actualizado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
