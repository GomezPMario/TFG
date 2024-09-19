const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://gomezpmario.github.io'], // Permite localhost y GitHub Pages
    methods: ['GET', 'POST', 'OPTIONS'], // Asegúrate de permitir los métodos necesarios
    allowedHeaders: ['Content-Type', 'Authorization'] // Permite headers que puedas necesitar
}));

// Middleware para procesar solicitudes JSON
app.use(express.json());

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Comprobar la conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Endpoint para obtener usuarios
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Error fetching users');
        }
        res.json(result);
    });
});

// Endpoint para manejar login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received login request:', { username, password });

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Error querying the database', error: err.message });
        }

        console.log('Query result:', result);

        if (result.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
