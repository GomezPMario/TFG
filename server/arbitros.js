const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM arbitros WHERE 1=1'; // Base SQL query
    const { orderBy, orderType, search, permission } = req.query; // Asegúrate de obtener el nuevo parámetro

    // Añadir búsqueda
    if (search) {
        sql += ` AND (username LIKE '%${search}%' OR nombre LIKE '%${search}%' OR apellido LIKE '%${search}%' OR alias LIKE '%${search}%' OR numero_colegiado LIKE '%${search}%')`;
    }

    // Filtrar por permiso
    if (permission) {
        sql += ` AND permiso = ?`; // Filtramos por permiso
    }

    // Filtrar por tipo de cargo
    if (orderBy === 'tipo_cargo' && orderType) {
        if (orderType === 'arbitro') {
            sql += ' AND cargo = 1'; // Filtrar árbitros
        } else if (orderType === 'oficial') {
            sql += ' AND cargo = 2'; // Filtrar oficiales
        }
    }

    // Añadir ordenamiento dinámico
    if (orderBy) {
        if (['numero_colegiado', 'cargo', 'categoria', 'permiso'].includes(orderBy)) {
            const orderDirection = orderType === 'desc' ? 'DESC' : 'ASC'; // Por defecto será ASC
            sql += ` ORDER BY ${orderBy} ${orderDirection}`;
        }
    } else {
        // Si no se selecciona un orden, ordenar por numero_colegiado ascendente
        sql += ' ORDER BY numero_colegiado ASC';
    }

    try {
        const params = permission ? [permission] : []; // Usa los parámetros de consulta
        console.log('Ejecutando consulta:', sql, params); // Añadir para debug
        const [result] = await db.query(sql, params);
        res.json(result);
    } catch (err) {
        console.error('Error querying the database:', err);
        return res.status(500).send(err);
    }
});

module.exports = router;
