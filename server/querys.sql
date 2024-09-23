CREATE TABLE IF NOT EXISTS escala (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria ENUM('A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela') NOT NULL,
    subcategoria ENUM('Principal', 'Auxiliar', 'Comodin') NOT NULL
);

CREATE TABLE IF NOT EXISTS arbitros (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (categoria_id) REFERENCES escala(id)
);

-- Inserta todas las combinaciones de categorías y subcategorías
INSERT INTO escala (categoria, subcategoria) VALUES
('A1', 'Principal'),
('A1', 'Auxiliar'),
('A1', 'Comodin'),
('A2', 'Principal'),
('A2', 'Auxiliar'),
('A2', 'Comodin'),
('A3', 'Principal'),
('A3', 'Auxiliar'),
('A3', 'Comodin'),
('A4', 'Principal'),
('A4', 'Auxiliar'),
('A4', 'Comodin'),
('P1', 'Principal'),
('P1', 'Auxiliar'),
('P1', 'Comodin'),
('P2', 'Principal'),
('P2', 'Auxiliar'),
('P2', 'Comodin'),
('P3', 'Principal'),
('P3', 'Auxiliar'),
('P3', 'Comodin'),
('Escuela', 'Principal'),
('Escuela', 'Auxiliar'),
('Escuela', 'Comodin');

-- Inserta árbitros sin permisos todavía, asignaremos los permisos en el siguiente paso
INSERT INTO arbitros (username, password, nombre, apellido, domicilio, cuenta, alias, numero_colegiado, permiso, categoria_id)
VALUES 
('arbitro1', 'password1', 'Juan', 'Pérez', 'Calle 123', 'cuenta1', 'arbitro1_alias', 1001, 1, 1),
('luis', 'luis', 'Luis Miguel', 'Lázaro', 'Federacion', 'cuenta1', 'luis', 1001, 1, 1),
('arbitro2', 'password2', 'Pedro', 'Gómez', 'Avenida 456', 'cuenta2', 'arbitro2_alias', 1002, 2, 3),
('mario', 'mario', 'Mario', 'Gómez', 'Federación', 'cuenta3', 'arbitro3_alias', 1003, 3, 2),
('arbitro3', 'password3', 'Luis', 'Ramírez', 'Plaza 789', 'cuenta3', 'arbitro3_alias', 1003, 3, 2); 