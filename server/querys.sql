CREATE TABLE IF NOT EXISTS escala (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria ENUM('A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela') NOT NULL,
    subcategoria ENUM('Principal', 'Auxiliar', 'Comodin') NOT NULL
);

CREATE TABLE IF NOT EXISTS arbitros(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255), 
    apellido VARCHAR(255), 
    domicilio VARCHAR(255),  
    cuenta VARCHAR(255),
    alias VARCHAR(255) NOT NULL, 
    numero_colegiado INT NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES escala(id)
);

