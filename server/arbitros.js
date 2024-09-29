const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM arbitros WHERE 1=1'; // Consulta base
    const { orderBy, orderType, search, permission } = req.query;

    // Filtrar por búsqueda (aplicable solo si no se está filtrando por permiso)
    if (orderBy !== 'permiso') {
        if (search) {
            sql += ` AND (username LIKE ? OR nombre LIKE ? OR apellido LIKE ? OR alias LIKE ? OR numero_colegiado LIKE ?)`;
        }
    }

    // Filtrar por permiso si se selecciona
    if (orderBy === 'permiso') {
        if (permission) {
            sql += ` AND permiso = ?`;
        }
    } else {
        // Filtrar por tipo de cargo
        if (orderBy === 'tipo_cargo' && orderType) {
            if (orderType === 'arbitro') {
                sql += ' AND cargo = 1';
            } else if (orderType === 'oficial') {
                sql += ' AND cargo = 2';
            }
        }
    }

    // Añadir ordenamiento dinámico por numero_colegiado
    const orderDirection = orderType === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY numero_colegiado ${orderDirection}`;

    try {
        // Parametros de búsqueda
        let params = [];
        if (search && orderBy !== 'permiso') {
            params = Array(5).fill(`%${search}%`);
        }
        if (permission) {
            params.push(permission);
        }

        console.log('Ejecutando consulta:', sql, params); // Debug
        const [result] = await db.query(sql, params);
        res.json(result);
    } catch (err) {
        console.error('Error querying the database:', err);
        return res.status(500).send(err);
    }
});

module.exports = router;
