const express = require('express');
const router = express.Router();
const db = require('./db_setup');

const dayMapping = {
    l: 'lunes',
    m: 'martes',
    x: 'miércoles',
    j: 'jueves',
    v: 'viernes',
    s: 'sábado',
    d: 'domingo'
};

// Ruta para insertar disponibilidad
router.post('/', async (req, res) => {
    console.log('Datos recibidos en el servidor:', req.body);
    const { arbitro_id, availabilityData } = req.body;

    if (!arbitro_id || !availabilityData) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    try {
        const queries = [];

        // Iterar por cada tipo de disponibilidad (Variable, Fija)
        Object.keys(availabilityData).forEach((tipo_disponibilidad) => {
            availabilityData[tipo_disponibilidad].forEach((entry) => {
                const dia_semana = dayMapping[entry.day.toLowerCase()]; // Mapear el día al formato esperado
                if (!dia_semana) {
                    throw new Error(`Día inválido: ${entry.day}`);
                }

                const hora_inicio = entry.start;
                const hora_fin = entry.end;
                const fecha = tipo_disponibilidad === 'Variable' ? calcularFechaVariable(dia_semana) : null;

                queries.push(
                    db.query(
                        `INSERT INTO disponibilidad (arbitro_id, tipo_disponibilidad, dia_semana, hora_inicio, hora_fin, fecha) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [arbitro_id, tipo_disponibilidad.toLowerCase(), dia_semana, hora_inicio, hora_fin, fecha]
                    )
                );
            });
        });

        await Promise.all(queries);

        res.status(200).json({ success: true, message: 'Disponibilidad insertada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al insertar disponibilidad' });
    }
});

// Función para calcular la fecha de disponibilidad variable (jueves a jueves)
const calcularFechaVariable = (dia) => {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const hoy = new Date();
    const diaActual = hoy.getDay(); // Día actual (0-6)
    const indiceDia = diasSemana.indexOf(dia);

    if (indiceDia === -1) return null;

    let diferencia = indiceDia - diaActual;
    if (diferencia < 0) {
        diferencia += 7; // Ajustar para la semana siguiente
    }

    const fechaVariable = new Date(hoy);
    fechaVariable.setDate(hoy.getDate() + diferencia);

    return fechaVariable.toISOString().split('T')[0]; // Retorna la fecha en formato YYYY-MM-DD
};

// Ruta para obtener disponibilidades por árbitro
router.get('/:arbitroId', async (req, res) => {
    const { arbitroId } = req.params;

    try {
        const [result] = await db.query(
            `SELECT id, tipo_disponibilidad, dia_semana, fecha, hora_inicio, hora_fin
             FROM disponibilidad
             WHERE arbitro_id = ?`,
            [arbitroId]
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las disponibilidades:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las disponibilidades.' });
    }
});

// Ruta para eliminar una disponibilidad
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(`DELETE FROM disponibilidad WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Disponibilidad eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la disponibilidad:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la disponibilidad.' });
    }
});


module.exports = router;
