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
    categoria_id INT NOT NULL,
    permiso_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES escala(id)
);

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso ENUM('1', '2', '3') NOT NULL,
    arbitro_id INT NOT NULL,
    FOREIGN KEY (arbitro_id) REFERENCES arbitros(id)
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
INSERT INTO arbitros (username, password, nombre, apellido, domicilio, cuenta, alias, numero_colegiado, categoria_id, permiso_id)
VALUES 
('arbitro1', 'password1', 'Juan', 'Pérez', 'Calle 123', 'cuenta1', 'arbitro1_alias', 1001, 1, 1),  -- Arbitro 1: A1, Principal, Permiso 1
('arbitro2', 'password2', 'Pedro', 'Gómez', 'Avenida 456', 'cuenta2', 'arbitro2_alias', 1002, 2, 3),  -- Arbitro 2: P2, Auxiliar, Permiso 3
('arbitro3', 'password3', 'Luis', 'Ramírez', 'Plaza 789', 'cuenta3', 'arbitro3_alias', 1003, 3, 2);  -- Arbitro 3: A2, Principal, Permiso 2


INSERT INTO admin (permiso, arbitro_id) VALUES 
('1', 1),  
('3', 2), 
('2', 3); 
