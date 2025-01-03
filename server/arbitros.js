const express = require('express');
const router = express.Router();
const db = require('./db_setup');
// const { hash } = require('bcrypt');

// router.get('/', async (req, res) => {
//     let sql = 'SELECT * FROM arbitros WHERE 1=1'; // Consulta base
//     const { orderBy, orderType, search, permission } = req.query;

//     if (orderBy !== 'permiso') {
//         if (search) {
//             sql += ` AND (username LIKE ? OR nombre LIKE ? OR apellido LIKE ? OR alias LIKE ? OR numero_colegiado LIKE ?)`;
//         }
//     }

//     if (orderBy === 'permiso') {
//         if (permission) {
//             sql += ` AND permiso = ?`;
//         }
//     } else {
//         if (orderBy === 'tipo_cargo' && orderType) {
//             if (orderType === 'arbitro') {
//                 sql += ' AND cargo = 1';
//             } else if (orderType === 'oficial') {
//                 sql += ' AND cargo = 2';
//             }
//         }
//     }

//     const orderDirection = orderType === 'desc' ? 'DESC' : 'ASC';
//     sql += ` ORDER BY numero_colegiado ${orderDirection}`;

//     try {
//         let params = [];
//         if (search && orderBy !== 'permiso') {
//             params = Array(5).fill(`%${search}%`);
//         }
//         if (permission) {
//             params.push(permission);
//         }

//         console.log('Ejecutando consulta:', sql, params); // Debug
//         const [result] = await db.query(sql, params);
//         res.json(result);
//     } catch (err) {
//         console.error('Error querying the database:', err);
//         return res.status(500).send(err);
//     }
// });

router.get('/', async (req, res) => {
    let sql = `
        SELECT a.*, e.categoria, e.nivel 
        FROM arbitros a 
        LEFT JOIN escala e ON a.categoria_id = e.id 
        WHERE 1=1
    `;

    const { orderBy, orderType, permission, category } = req.query;
    const params = [];

    // Filtrar por tipo de cargo solo si hay un valor válido
    if (orderBy === 'tipo_cargo' && orderType && ['arbitro', 'oficial'].includes(orderType)) {
        sql += ` AND a.cargo = ?`;
        params.push(orderType === 'arbitro' ? 1 : 2);
    }

    // Filtrar por permiso
    if (orderBy === 'permiso' && permission) {
        sql += ` AND a.permiso = ?`;
        params.push(permission);
    }

    // Filtrar por categoría
    if (orderBy === 'categoria' && category) {
        sql += ` AND e.categoria = ? ORDER BY e.nivel ASC, a.orden ASC`;
        params.push(category);
    }

    // Ordenar por número colegiado
    if (orderBy === 'numero_colegiado') {
        sql += ` ORDER BY a.numero_colegiado ${orderType === 'desc' ? 'DESC' : 'ASC'}`;
    }

    try {
        const [result] = await db.query(sql, params);
        res.json(result);
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send(err);
    }
});

router.delete('/', async (req, res) => {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron IDs para eliminar.' });
    }

    try {
        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM arbitros WHERE id IN (${placeholders})`;

        await db.query(sql, ids);

        res.status(200).json({ message: 'Árbitros eliminados correctamente.' });
    } catch (error) {
        console.error('Error eliminando árbitros:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


const combinarApellidos = (primerApellido, segundoApellido) => {
    return `${primerApellido} ${segundoApellido}`;
};

router.post('/categoria-id', async (req, res) => {
    const { categoria, nivel } = req.body;

    try {
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
        categoria_id  
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
        } else if (!(await checkAlias(nombre))) {
            alias = nombre;
        } else {
            return res.status(400).json({ message: 'Ponte en contacto con Luis para gestionar la creación de tu usuario' });
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

router.get('/licencia', async (req, res) => {
    try {
        const [licencias] = await db.query('SELECT numero_colegiado FROM numeros_colegiado ORDER BY numero_colegiado ASC');
        res.json(licencias);
    } catch (error) {
        console.error('Error al obtener los números de colegiado:', error.message);
        res.status(500).json({ message: 'Error al obtener los números de colegiado' });
    }
});

router.post('/licencia', async (req, res) => {
    const { numero_colegiado } = req.body;

    try {
        // Verificar si el número de colegiado ya existe en la tabla de arbitros
        const [rows] = await db.query('SELECT numero_colegiado FROM arbitros WHERE numero_colegiado = ?', [numero_colegiado]);

        if (rows.length > 0) {
            // Si el número ya existe, responder con un error 400
            return res.status(400).json({ message: 'El número de colegiado ya existe' });
        }

        // Insertar el nuevo número de colegiado en la tabla de numeros_colegiado
        await db.query('INSERT INTO numeros_colegiado (numero_colegiado) VALUES (?)', [numero_colegiado]);
        res.status(200).json({ message: 'Licencia añadida correctamente' });
    } catch (error) {
        console.error('Error al añadir licencia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// eliminar numeros de colegiado
router.delete('/licencia/:numero_colegiado', async (req, res) => {
    const { numero_colegiado } = req.params;

    try {
        const [result] = await db.query('DELETE FROM numeros_colegiado WHERE numero_colegiado = ?', [numero_colegiado]);

        if (result.affectedRows > 0) {
            // Si se eliminó una fila, responde con éxito
            res.status(200).json({ message: 'Licencia eliminada correctamente' });
        } else {
            // Si no se eliminó ninguna fila, responde con error
            res.status(404).json({ message: 'Licencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar licencia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/export', async (req, res) => {
    const { fields } = req.body;

    if (!fields || fields.length === 0) {
        return res.status(400).json({ error: 'No se seleccionaron campos para exportar.' });
    }

    try {
        // Genera la lista de columnas seleccionadas según los checkboxes
        let columns = fields.join(', ');

        // Incluye 'categoria' o 'nivel' en la consulta si han sido seleccionados individualmente
        if (fields.includes('categoria')) {
            columns += ', e.categoria';
        }
        if (fields.includes('nivel')) {
            columns += ', e.nivel';
        }

        // Ejecuta el JOIN solo si 'categoria' o 'nivel' están seleccionados
        const query = `
            SELECT ${columns}
            FROM arbitros a
            ${fields.includes('categoria') || fields.includes('nivel') ? 'JOIN escala e ON a.categoria_id = e.id' : ''}
        `;

        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al exportar los datos.' });
    }
});

const obtenerCategoriaId = async (categoria, nivel) => {
    const [rows] = await db.query(
        'SELECT id FROM escala WHERE categoria = ? AND nivel = ?',
        [categoria, nivel]
    );
    return rows.length > 0 ? rows[0].id : null;
};

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT a.*, e.categoria, e.nivel
            FROM arbitros a
            LEFT JOIN escala e ON a.categoria_id = e.id
            WHERE a.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Árbitro no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener detalles del árbitro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para actualizar el perfil
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        // Eliminar el campo "foto" de updatedData, si existe
        delete updatedData.foto;

        const categoriaId = await obtenerCategoriaId(updatedData.categoria, updatedData.nivel);
        if (!categoriaId) {
            return res.status(404).json({ success: false, message: 'Categoría o subcategoría no encontrada' });
        }

        await db.query(
            'UPDATE arbitros SET username = ?, password = ?, nombre = ?, apellido = ?, domicilio = ?, telefono = ?, email = ?, cuenta = ?, permiso = ?, categoria_id = ?, numero_colegiado = ?, alias = ?, fecha_nacimiento = ?, vehiculo = ? WHERE id = ?',
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
                updatedData.numero_colegiado,
                updatedData.alias,
                updatedData.fecha_nacimiento,
                updatedData.vehiculo,
                id
            ]
        );

        res.json({ success: true, message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el perfil' });
    }
});


// Ruta para actualizar la foto de perfil
// router.put('/:id/foto', async (req, res) => {
//     const { id } = req.params;
//     const { foto } = req.body;

//     try {
//         // Primero, verifica si ya existe una foto para este árbitro
//         const [rows] = await db.query(
//             `SELECT id FROM foto_arbitros WHERE arbitro_id = ? LIMIT 1`,
//             [id]
//         );

//         if (rows.length > 0) {
//             // Si existe, realiza un UPDATE
//             await db.query(
//                 `UPDATE foto_arbitros SET foto = ? WHERE arbitro_id = ?`,
//                 [Buffer.from(foto, 'base64'), id]
//             );
//             res.json({ success: true, message: 'Foto de perfil actualizada correctamente' });
//         } else {
//             // Si no existe, realiza un INSERT
//             await db.query(
//                 `INSERT INTO foto_arbitros (arbitro_id, foto) VALUES (?, ?)`,
//                 [id, Buffer.from(foto, 'base64')]
//             );
//             res.json({ success: true, message: 'Foto de perfil guardada correctamente' });
//         }
//     } catch (error) {
//         console.error('Error al guardar la foto de perfil:', error);
//         res.status(500).json({ success: false, message: 'Error al guardar la foto de perfil' });
//     }
// });

// Ruta para actualizar la foto de perfil
router.put('/:id/foto', async (req, res) => {
    const { id } = req.params;
    const { foto } = req.body;

    try {
        const fotoBuffer = Buffer.from(foto, 'base64');

        // Verificar si ya existe una foto
        const [rows] = await db.query(
            `SELECT id FROM foto_arbitros WHERE arbitro_id = ? LIMIT 1`,
            [id]
        );

        if (rows.length > 0) {
            await db.query(`UPDATE foto_arbitros SET foto = ? WHERE arbitro_id = ?`, [fotoBuffer, id]);
        } else {
            await db.query(`INSERT INTO foto_arbitros (arbitro_id, foto) VALUES (?, ?)`, [id, fotoBuffer]);
        }

        // Devolver la foto actualizada en formato base64
        res.json({ success: true, message: 'Foto actualizada correctamente', foto: `data:image/jpeg;base64,${foto}` });
    } catch (error) {
        console.error('Error al guardar la foto de perfil:', error);
        res.status(500).json({ success: false, message: 'Error al guardar la foto de perfil' });
    }
});


// Ruta para obtener la foto de perfil de un árbitro específico
// router.get('/foto/:arbitroId', async (req, res) => {
//     const { arbitroId } = req.params;

//     try {
//         const [rows] = await db.query(
//             `SELECT foto FROM foto_arbitros WHERE arbitro_id = ? LIMIT 1`,
//             [arbitroId]
//         );

//         if (rows.length > 0 && rows[0].foto) {
//             const fotoBase64 = Buffer.from(rows[0].foto).toString('base64');
//             res.json({ foto: `data:image/jpeg;base64,${fotoBase64}` });
//         } else {
//             res.status(404).json({ error: 'Foto no encontrada' });
//         }
//     } catch (error) {
//         console.error("Error al obtener la foto:", error);
//         res.status(500).json({ error: 'Error al obtener la foto' });
//     }
// });

router.get('/foto/:arbitroId', async (req, res) => {
    const { arbitroId } = req.params;

    try {
        console.log(`Buscando foto para el árbitro con ID: ${arbitroId}`);

        const [rows] = await db.query(
            `SELECT foto FROM foto_arbitros WHERE arbitro_id = ? LIMIT 1`,
            [arbitroId]
        );

        if (rows.length > 0 && rows[0].foto) {
            console.log('Foto encontrada en la base de datos:', rows[0].foto);
            const fotoBase64 = Buffer.from(rows[0].foto).toString('base64');
            res.json({ foto: `data:image/jpeg;base64,${fotoBase64}` });
        } else {
            console.log('No se encontró una foto para este árbitro.');
            res.status(404).json({ error: 'Foto no encontrada' });
        }
    } catch (error) {
        console.error("Error al obtener la foto:", error);
        res.status(500).json({ error: 'Error al obtener la foto' });
    }
});




module.exports = router;