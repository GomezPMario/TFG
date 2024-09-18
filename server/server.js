const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Puerto del servidor Express

app.use(cors({
    origin: 'https://gomezpmario.github.io/TFG'
}));
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Verificar la conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Ruta de ejemplo para obtener todos los datos de la tabla 'users'
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// Ruta para autenticación de usuarios
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });

    const sql = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Error querying the database' });
        }

        console.log('Query result:', result);

        if (result.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
