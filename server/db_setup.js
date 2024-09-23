const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Crear la conexión con la base de datos utilizando las variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Intentar conectarse a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

db.end();

// Exportar la conexión para poder usarla en otros archivos si es necesario
module.exports = db;

