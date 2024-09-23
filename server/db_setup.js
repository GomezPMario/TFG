const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
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
    // No hacemos nada más aquí, solo se conecta a la base de datos
});

// Exportar la conexión para poder usarla en otros archivos si es necesario
module.exports = db;
