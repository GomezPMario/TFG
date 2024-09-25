const express = require('express');
const mysql = require('mysql2/promise'); // Asegúrate de usar mysql2/promise
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db_setup');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Verifica las variables de entorno cargadas
console.log('Database host:', process.env.DB_HOST);
console.log('Database name:', process.env.DB_NAME);
console.log('Database user:', process.env.DB_USER);
console.log('Database port:', process.env.DB_PORT);

app.options('*', cors());
app.use(cors({
    origin: ['http://localhost:3000', 'https://gomezpmario.github.io'], // Añade el origen de GitHub Pages
}));
app.use(express.json());

// Endpoint para obtener todos los árbitros
app.get('/allarbitros', async (req, res) => {
    const sql = 'SELECT * FROM arbitros';
    try {
        const [result] = await db.query(sql); // Usa db aquí
        res.json(result);
    } catch (err) {
        console.error('Error querying the database:', err);
        return res.status(500).send(err);
    }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM arbitros WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            const arbitro = rows[0];
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                arbitro: {
                    username: arbitro.username,
                    password: arbitro.password,
                    nombre: arbitro.nombre,
                    apellido: arbitro.apellido,
                    domicilio: arbitro.domicilio,
                    cuenta: arbitro.cuenta,
                    alias: arbitro.alias,
                    numero_colegiado: arbitro.numero_colegiado,
                    permiso: arbitro.permiso,
                    categoria_id: arbitro.categoria_id
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