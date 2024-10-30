const mysql = require('mysql2/promise'); // Usa mysql2/promise
const dotenv = require('dotenv');

dotenv.config();

// Crear la conexión con la base de datos utilizando las variables de entorno
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
});

// Exportar la conexión para poder usarla en otros archivos
module.exports = db;
