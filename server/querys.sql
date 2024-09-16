-- TABLA USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    domicilio TEXT,
    numero_colegiado INT UNIQUE,
    alias VARCHAR(50) UNIQUE,
    cuenta_corriente VARCHAR(50)
);
