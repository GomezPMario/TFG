const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db_setup');
// const perfilRoutes = require('./arbitros');
const arbitrosRoutes = require('./arbitros');
const partidos = require('./partidos');
const informes = require('./informes');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Verifica las variables de entorno cargadas
// console.log('Database host:', process.env.DB_HOST);
// console.log('Database name:', process.env.DB_NAME);
// console.log('Database user:', process.env.DB_USER);
// console.log('Database port:', process.env.DB_PORT);

// app.options('*', cors());
// app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://gomezpmario.github.io'], // Añade el origen de GitHub Pages
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true
// }));

// app.use(express.json({ limit: '10mb' })); // Agregar límite de tamaño de JSON
// app.use(express.urlencoded({ limit: '10mb', extended: true })); // Límite para datos en URL-encoded

// // app.use('/api', perfilRoutes);
// app.use('/arbitros', arbitrosRoutes);
// app.use('/', partidos);


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Cargar configuración de CORS y límites de carga antes de las rutas
app.use(cors({
    origin: ['http://localhost:3000', 'https://gomezpmario.github.io'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Configuración de límites para JSON y datos en URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas de la aplicación
app.use('/arbitros', arbitrosRoutes);
app.use('/', partidos);
app.use('/api/informes', informes);


// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query(
            `SELECT arbitros.*, escala.categoria, escala.nivel 
            FROM arbitros 
            JOIN escala ON arbitros.categoria_id = escala.id 
            WHERE username = ? AND password = ?`,
            [username, password]
        );

        if (rows.length > 0) {
            const arbitro = rows[0];

            // Nueva consulta para obtener la foto del árbitro
            const [fotoRows] = await db.query(
                `SELECT foto FROM foto_arbitros WHERE arbitro_id = ? LIMIT 1`,
                [arbitro.id]
            );

            // Si existe una foto, conviértela a base64
            const fotoBase64 = fotoRows.length > 0 ? fotoRows[0].foto.toString('base64') : null;

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                arbitro: {
                    id: arbitro.id,
                    username: arbitro.username,
                    password: arbitro.password,
                    nombre: arbitro.nombre,
                    apellido: arbitro.apellido,
                    domicilio: arbitro.domicilio,
                    telefono: arbitro.telefono,
                    email: arbitro.email,
                    cuenta: arbitro.cuenta,
                    alias: arbitro.alias,
                    numero_colegiado: arbitro.numero_colegiado,
                    permiso: arbitro.permiso,
                    cargo: arbitro.cargo,
                    categoria_id: arbitro.categoria_id,
                    categoria: arbitro.categoria,
                    nivel: arbitro.nivel,
                    vehiculo: arbitro.vehiculo,
                    fecha_nacimiento: arbitro.fecha_nacimiento,
                    foto: fotoBase64,  // Agregar la foto en formato base64
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


// Escuchando en el puerto configurado
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});