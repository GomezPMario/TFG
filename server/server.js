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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });

    const sql = 'SELECT * FROM arbitros WHERE username = ? AND password = ?';
    console.log('Running SQL:', sql, [username, password]); // Log para mostrar la consulta y los valores que se pasan
    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Error querying the database', error: err.message });
        }

        console.log('Query result:', result); // Log para mostrar el resultado de la consulta

        if (result.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Escuchando en el puerto configurado
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
