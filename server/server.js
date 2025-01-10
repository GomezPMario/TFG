const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Importar módulos
const db = require('./db_setup');
const arbitrosRoutes = require('./arbitros');
const partidosRoutes = require('./partidos');
const informesRoutes = require('./informes');
const tarifasRoutes = require('./tarifas');
const camposRoutes = require('./campos');
const categoriasRoutes = require('./categorias');
const equiposRoutes = require('./equipos');
const miscelaneoRoutes = require('./miscelaneo');
const disponibilidadRoutes = require('./disponibilidad');

// Cargar configuración de entorno
dotenv.config();

// Inicializar aplicación
const app = express();
const port = process.env.PORT || 5000;

// Middleware global
// app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000', 'https://gomezpmario.github.io'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Deshabilitar caché
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Verificar conexión a la base de datos
(async () => {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('Conexión a la base de datos exitosa:', rows);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

// Rutas
app.use('/arbitros', arbitrosRoutes);
app.use('/api/informes', informesRoutes);
app.use('/api', tarifasRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/campos', camposRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/miscelaneo', miscelaneoRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query(
            `SELECT arbitros.*, escala.categoria, escala.nivel 
            FROM arbitros 
            JOIN escala ON arbitros.categoria_id = escala.id 
            WHERE BINARY username = ? AND BINARY password = ?`,
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
});


// Escuchando en el puerto configurado
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});