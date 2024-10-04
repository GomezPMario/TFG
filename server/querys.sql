CREATE TABLE escala (
    id INT NOT NULL AUTO_INCREMENT,
    categoria VARCHAR(255) NOT NULL,
    nivel ENUM('1', '2', '3') NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE arbitros (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    domicilio VARCHAR(255),
    cuenta VARCHAR(255),
    alias VARCHAR(255) NOT NULL,
    numero_colegiado INT NOT NULL,
    permiso ENUM('1', '2', '3') NOT NULL,
    categoria_id INT NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo ENUM('1', '2') NOT NULL,
    orden INT NULL,
    FOREIGN KEY (categoria_id) REFERENCES escala(id)
);

-- Inserta todas las combinaciones de categorías y subcategorías
INSERT INTO escala (categoria, nivel) VALUES
('ACB', '1'),
('ACB', '2'),
('LF', '1'),
('LF', '2'),
('1 FEB', '1'),
('2 FEB', '1'),
('3 FEB', '1'),
('3 FEB', '2'),
('1 DIV', '1'),
('1 DIV', '2'),
('1 DIV', '3'),
('A1', '1'),
('A1', '2'),
('A1', '3'),
('A2', '1'),
('A2', '2'),
('A2', '3'),
('A3', '1'),
('A3', '2'),
('A3', '3'),
('A4', '1'),
('A4', '2'),
('A4', '3'),
('P1', '1'),
('P1', '2'),
('P1', '3'),
('P2', '1'),
('P2', '2'),
('P2', '3'),
('P3', '1'),
('P3', '2'),
('P3', '3'),
('Escuela', '1'),
('Escuela', '2'),
('Escuela', '3');

-- Inserta árbitros sin permisos todavía, asignaremos los permisos en el siguiente paso
INSERT INTO arbitros (username, password, nombre, apellido, domicilio, cuenta, alias, numero_colegiado, permiso, categoria_id, telefono, email, cargo, orden)
VALUES 
('luis', 'luis', 'Luis', 'Pérez', 'Calle Mayor 1', '12345678', 'luis', 10001, '1', 1, '123456789', 'luis@example.com', '1', 1),
('juan', 'juan123', 'Juan', 'García', 'Avenida del Sol 23', '23456789', 'juan', 10002, '2', 2, '987654321', 'juan@example.com', '2', 2),
('maria', 'maria456', 'Maria', 'López', 'Calle del Río 45', '34567890', 'maria', 10003, '1', 3, '654321987', 'maria@example.com', '1', 3),
('carlos', 'carlos789', 'Carlos', 'Martínez', 'Plaza de España 12', '45678901', 'carlos', 10004, '3', 4, '321654987', 'carlos@example.com', '2', NULL),
('ana', 'ana321', 'Ana', 'Sánchez', 'Calle Luna 78', '56789012', 'ana', 10005, '2', 5, '147258369', 'ana@example.com', '1', NULL),
('pedro', 'pedro987', 'Pedro', 'Hernández', 'Avenida de las Flores 5', '67890123', 'pedro', 10006, '1', 6, '369258147', 'pedro@example.com', '2', 4);
