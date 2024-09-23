const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

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

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Intento de conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});


app.get('/allarbitros', (req, res) => {
    const sql = 'SELECT * FROM arbitros';
    console.log('Running SQL:', sql); // Log para mostrar la consulta que se va a ejecutar
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send(err);
        }
        console.log('Query result:', result); // Log para mostrar el resultado de la consulta
        res.json(result);
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username, password); // Añade esta línea

    try {
        const [rows] = await db.query(
            'SELECT username, password, nombre, apellido, domicilio, cuenta, alias, numero_colegiado, permiso, categoria_id FROM arbitros WHERE username = ? AND password = ?',
            [username, password]
        );

        console.log('Query result:', rows); // Añade esta línea

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
        console.error(error); // Asegúrate de ver el error en la consola
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});



// Escuchando en el puerto configurado
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
