const express = require('express');
const router = express.Router();
const pool = require('./db_setup'); // Asegúrate de tener la conexión a la base de datos

// Función para obtener el ID de la categoría
// Función para obtener el ID de la categoría
const obtenerCategoriaId = async (categoria, subcategoria) => {
    const [rows] = await pool.query(
        'SELECT id FROM escala WHERE categoria = ? AND subcategoria = ?',
        [categoria, subcategoria]
    );
    return rows.length > 0 ? rows[0].id : null;
};

// Ruta para actualizar el perfil
router.put('/updatePerfil/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        // Obtener el ID de la categoría correspondiente
        const categoriaId = await obtenerCategoriaId(updatedData.categoria, updatedData.subcategoria);
        if (!categoriaId) {
            return res.status(404).json({ success: false, message: 'Categoría o subcategoría no encontrada' });
        }

        // Actualizar el perfil en la base de datos
        await pool.query(
            'UPDATE arbitros SET username = ?, password = ?, nombre = ?, apellido = ?, domicilio = ?, telefono = ?, email = ?, cuenta = ?, permiso = ?, categoria_id = ?, numero_colegiado = ?, alias = ? WHERE id = ?',
            [
                updatedData.username,
                updatedData.password,
                updatedData.nombre,
                updatedData.apellido,
                updatedData.domicilio,
                updatedData.telefono,
                updatedData.email,
                updatedData.cuenta,
                updatedData.permiso,
                categoriaId,
                updatedData.numero_colegiado,  // Asegúrate de incluir esto
                updatedData.alias,               // Aquí se añade el alias
                id
            ]
        );

        res.json({ success: true, message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el perfil' });
    }
});

// Exportar el router
module.exports = router;
