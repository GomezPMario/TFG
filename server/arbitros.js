const express = require('express');
const router = express.Router();
const db = require('./db_setup');

router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM arbitros WHERE 1=1'; // Consulta base
    const { orderBy, orderType, search, permission } = req.query;

    // Reiniciar filtros si se selecciona un filtro específico
    // Si se selecciona `Cargo`, no se aplica `Permiso`, y viceversa
    if (orderBy !== 'permiso') {
        // Filtrar por búsqueda (pero solo si no se selecciona el filtro de `permiso`)
        if (search) {
            sql += ` AND (username LIKE ? OR nombre LIKE ? OR apellido LIKE ? OR alias LIKE ? OR numero_colegiado LIKE ?)`;
        }
    }

    // Filtrar por `permiso` si está seleccionado y resetear otros filtros
    if (orderBy === 'permiso') {
        if (permission) {
            sql += ` AND permiso = ?`;
        }
    } else {
        // Si no se selecciona un permiso, aplicar otros filtros
        // Filtrar por tipo de cargo
        if (orderBy === 'tipo_cargo' && orderType) {
            if (orderType === 'arbitro') {
                sql += ' AND cargo = 1';
            } else if (orderType === 'oficial') {
                sql += ' AND cargo = 2';
            }
        }
    }

    // Añadir ordenamiento dinámico
    if (orderBy) {
        if (['numero_colegiado', 'cargo', 'categoria', 'permiso'].includes(orderBy)) {
            const orderDirection = orderType === 'desc' ? 'DESC' : 'ASC';
            sql += ` ORDER BY ${orderBy} ${orderDirection}`;
        }
    } else {
        // Si no se selecciona ningún filtro específico, ordenamos por número colegiado ascendente
        sql += ' ORDER BY numero_colegiado ASC';
    }

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
