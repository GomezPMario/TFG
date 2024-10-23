const express = require('express');
const router = express.Router();
const db = require('./db_setup');
// const { hash } = require('bcrypt');

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

const combinarApellidos = (primerApellido, segundoApellido) => {
    return `${primerApellido} ${segundoApellido}`;
};

// Nueva ruta para obtener el categoria_id
router.post('/categoria-id', async (req, res) => {
    const { categoria, nivel } = req.body;

    try {
        // Consulta para obtener el categoria_id basado en la categoría y nivel
        const [result] = await db.query(`
            SELECT id FROM escala 
            WHERE categoria = ? AND nivel = ? 
            LIMIT 1
        `, [categoria, nivel]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ categoria_id: result[0].id });
    } catch (err) {
        console.error('Error al obtener categoria_id:', err.message);
        res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
});

// Actualización de la ruta para insertar nuevo árbitro
router.post('/nuevoarbitro', async (req, res) => {
    const {
        nombre,
        primerApellido,
        segundoApellido,
        dni,
        correo_electronico,
        fecha_nacimiento,
        telefono,
        domicilio,
        cuenta_bancaria,
        coche,
        moto,
        cargo,
        permiso,
        categoria_id  // Recibimos el categoria_id desde el frontend
    } = req.body;

    try {
        // 1. Obtener el primer numero_colegiado disponible
        const [numeroColegiadoResult] = await db.query(`SELECT numero_colegiado FROM numeros_colegiado ORDER BY numero_colegiado ASC LIMIT 1`);
        if (numeroColegiadoResult.length === 0) {
            return res.status(400).json({ message: 'No hay números colegiados disponibles' });
        }

        const numeroColegiado = numeroColegiadoResult[0].numero_colegiado;
        console.log('Número colegiado seleccionado:', numeroColegiado); // Debug del número colegiado

        // 2. Eliminar el numero_colegiado de la tabla numeros_colegiados
        await db.query(`DELETE FROM numeros_colegiado WHERE numero_colegiado = ?`, [numeroColegiado]);
        console.log('Número colegiado eliminado de la tabla numeros_colegiado:', numeroColegiado);

        // 3. Comprobación de alias
        let alias = '';
        const checkAlias = async (campo) => {
            const [result] = await db.query(`SELECT COUNT(*) as count FROM arbitros WHERE alias = ?`, [campo]);
            return result[0].count > 0;
        };

        if (!(await checkAlias(primerApellido))) {
            alias = primerApellido;
        } else if (!(await checkAlias(segundoApellido))) {
            alias = segundoApellido;
        }

        alias = alias || '';
        console.log('Alias seleccionado:', alias); // Depuración de alias

        // 4. Combinación de apellidos
        const apellidoCompleto = combinarApellidos(primerApellido, segundoApellido);
        console.log('Apellidos combinados:', apellidoCompleto); // Depuración de apellidos

        // 5. Cifrar la contraseña (opcional, no implementado en este ejemplo)

        // 6. Determinar el estado del campo "vehiculo"
        let vehiculo = '0'; // Valor por defecto para el campo enum
        if (coche && moto) {
            vehiculo = '3'; // Ambos activados
        } else if (coche) {
            vehiculo = '1'; // Solo coche
        } else if (moto) {
            vehiculo = '2'; // Solo moto
        }
        console.log('Estado del vehículo:', vehiculo); // Depuración de vehículo

        // 7. Determinar el valor de "cargo" (1 = Árbitro, 2 = Oficial)
        let cargoValue = cargo === 'arbitro' ? '1' : '2';
        console.log('Valor de cargo:', cargoValue); // Depuración de cargo

        // 8. Guardar los datos en la base de datos con el categoria_id correcto
        const sql = `
            INSERT INTO arbitros 
            (nombre, apellido, alias, username, password, email, fecha_nacimiento, telefono, domicilio, cuenta, vehiculo, permiso, categoria_id, numero_colegiado, cargo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombre,
            apellidoCompleto,
            alias,
            dni,
            12345,  // Contraseña predeterminada
            correo_electronico,
            fecha_nacimiento,
            telefono,
            domicilio,
            cuenta_bancaria,
            vehiculo,
            permiso || '3',  // Permiso por defecto '3' si no se proporciona
            categoria_id,  // Aquí usamos el categoria_id que nos llegó del frontend
            numeroColegiado,
            cargoValue
        ];

        console.log('Valores a insertar:', values); // Depuración final antes de la inserción

        await db.query(sql, values);

        console.log('Inserción exitosa en la base de datos');
        res.status(201).json({ message: 'Árbitro registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar el árbitro:', err.message);
        res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
});

module.exports = router;
