const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');

    // Crear tabla si no existe (ajusta las columnas según tus necesidades)
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            domicilio VARCHAR(255) NOT NULL,
            numero_colegiado INT NOT NULL,
            alias VARCHAR(255) NOT NULL
        );
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table created or already exists.');

        // Insertar datos
        const insertDataQuery = `
            INSERT INTO users (username, password, nombre, apellido, domicilio, numero_colegiado, alias) 
            VALUES ('1234567Q', '12345', 'Mario', 'Gómez', 'Federacion', 224, 'PEÑA');
        `;

        db.query(insertDataQuery, (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return;
            }
            console.log('Data inserted.');
            db.end();
        });
    });
});