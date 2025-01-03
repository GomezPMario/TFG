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
    -- 1 admin, 2 tecnico, 3 arbitro
    categoria_id INT NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo ENUM('1', '2') NOT NULL,
    -- 1 arbitro, 2 oficial
    orden INT NULL,
    FOREIGN KEY (categoria_id) REFERENCES escala(id)
);

ALTER TABLE arbitros
ADD COLUMN vehiculo ENUM('0', '1', '2', '3') DEFAULT '0' NOT NULL,
ADD COLUMN fecha_nacimiento DATE;
-- 0 ningun vehiculo
-- 1 coche, no moto
-- 2 moto, no coche
-- 3 ambas

CREATE TABLE foto_arbitros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    arbitro_id INT NOT NULL,
    foto LONGBLOB,
    FOREIGN KEY (arbitro_id) REFERENCES arbitros(id) ON DELETE CASCADE
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


CREATE TABLE numeros_colegiado (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numero_colegiado INT NOT NULL
);

INSERT INTO numeros_colegiado (numero_colegiado) VALUES
(100),
(102),
(103),
(104),
(105),
(106),
(107),
(108),
(109),
(110),
(111),
(112),
(113),
(114),
(115),
(116),
(117),
(118),
(119),
(120),
(121),
(122),
(123),
(124),
(125),
(126),
(127),
(128),
(129),
(130),
(131),
(132),
(133),
(134),
(135),
(136),
(137),
(138),
(139),
(140),
(141),
(142),
(143),
(144),
(145),
(146),
(147),
(148),
(149),
(150),
(151),
(152),
(153),
(154),
(155),
(156),
(157),
(158),
(159),
(160),
(161),
(162),
(163),
(164),
(165),
(166),
(167),
(168),
(169),
(170),
(171),
(172),
(173),
(174),
(175),
(176),
(177),
(178),
(179),
(180),
(181),
(182),
(183),
(184),
(185),
(186),
(187),
(188),
(189),
(190),
(191),
(192),
(193),
(194),
(195),
(196),
(197),
(198),
(199),
(200),
(201),
(202),
(203),
(204),
(205),
(206),
(207),
(208),
(209),
(210),
(211),
(212),
(213),
(214),
(215),
(216),
(217),
(218),
(219),
(220),
(221),
(222),
(223),
(224),
(225),
(226),
(227),
(228),
(229),
(230),
(231),
(232),
(233),
(234),
(235),
(236),
(237),
(238),
(239),
(240),
(241),
(242),
(243),
(244),
(245),
(246),
(247),
(248),
(249),
(250),
(251),
(252),
(253),
(254),
(255),
(256),
(257),
(258),
(259),
(260),
(261),
(262),
(263),
(264),
(265),
(266),
(267),
(268),
(269),
(270),
(271),
(272),
(273),
(274),
(275),
(276),
(277),
(278),
(279),
(280),
(281),
(282),
(283),
(284),
(285),
(286),
(287);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

ALTER TABLE categorias
ADD COLUMN padre INT,
ADD CONSTRAINT fk_categoria_padre
FOREIGN KEY (padre) REFERENCES categorias(id)
ON DELETE SET NULL;

INSERT INTO categorias (nombre, padre) VALUES
('ACB', 37),
('LIGA FEM', 37),
('2ª FEB', 37),
('LIGA FEM 2', 37),
('3ª FEB', 37),
('COPA ESPAÑA', 37),
('SILLA RUEDAS (1ª DIV)', 37),
('1ª MASC A1', 37),
('COPA 1ª MASC', 37),
('1ª MASC A2', 37),
('1ª FEM A1 (Liga Regular)', 37),
('1ª FEM A1 (Semis y Final)', 37),
('COPA 1ª FEM', 37),
('1ª FEM A2', 37),
('2ª ARAG MASC', 37),
('2ª ARAG FEM', 37),
('3ª ARAG MASC', 37),
('3ª ARAG FEM', 37),
('LIGA SOCIAL', 37),
('CTO. ARAGÓN JUNIOR MASC 1ª', 37),
('CTO. ARAGÓN JUNIOR FEM 1ª', 37),
('CTO. ARAGÓN JUNIOR MASC 2ª', 37),
('CTO. ARAGÓN JUNIOR FEM 2ª', 37),
('CTO. ARAGÓN JUNIOR MASC 3ª', 37),
('CTO. ARAGÓN JUNIOR FEM 3ª', 37),
('FINALES CTO. ARAGÓN ESCOLAR', 36),
('CATEG. INFERIORES', 36),
('ESCUELA', 36),
('CADETE FEMENINO A', 36),
('ALEVÍN MASCULINO B', 65),
('CADETE MASCULINO B', 63),
('3x3 SENIOR (cada 20 min)', 37),
('3x3 JUNIOR (cada 20 min)', 37),
('3x3 ESCOLAR (cada 20 min)', 37),
('3x3 SENIOR (cada 25 min)', 37),
('3x3 JUNIOR (cada 25 min)', 37),
('3x3 ESCOLAR (cada 25 min)', 37);

CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

ALTER TABLE equipos
ADD COLUMN ubicacion VARCHAR(255) DEFAULT 'Por determinar';

-- Equipos para 2ª Aragonesa Masculina (id categoría = 1)
INSERT INTO equipos (nombre, categoria_id) VALUES 
    ('OLD SCHOOL', 1),
    ('REINO DE ARAGÓN', 1),
    ('BASKET LA ALMUNIA', 1),
    ('ALIERTA AUGUSTO SALAS A', 1),
    ('DOCTOR AZÚA', 1),
    ('CBA-VILLAMAYOR BODEGAS SOMMOS', 1);

-- Equipos para ACB (id categoría = 2)
INSERT INTO equipos (nombre, categoria_id) VALUES 
    ('CASADEMONT ZARAGOZA', 2),
    ('FC BARCELONA', 2),
    ('REAL MADRID', 2),
    ('UCAM MURCIA', 2),
    ('JUVENTUT', 2),
    ('BÀSQUET GIRONA', 2);

-- Equipos para 1ª Femenina A1 (id categoría = 3)
INSERT INTO equipos (nombre, categoria_id) VALUES 
    ('CASADEMONT ZARAGOZA', 3),
    ('AD ALIERTA AUGUSTO SALAS', 3),
    ('EM EL OLIVAR', 3),
    ('CN HELIOS', 3),
    ('MARIANISTAS', 3),
    ('STADIUM VENECIA', 3);

CREATE TABLE funciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO funciones (nombre) VALUES 
    ('Principal'),
    ('Auxiliar 1'),
    ('Auxiliar 2'),
    ('Anotador'),
    ('Cronometrador'),
    ('24 segundos'),
    ('Ayudante de Anotador');

CREATE TABLE partidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia DATE NOT NULL,
    hora TIME NOT NULL,
    funcion_id INT NOT NULL,
    categoria_id INT NOT NULL,
    equipo_a_id INT NOT NULL,
    equipo_b_id INT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    autobus TEXT,
    anotaciones TEXT,
    FOREIGN KEY (funcion_id) REFERENCES funciones(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (equipo_a_id) REFERENCES equipos(id),
    FOREIGN KEY (equipo_b_id) REFERENCES equipos(id)
);

ALTER TABLE partidos DROP COLUMN ubicacion;

CREATE TABLE partidos_arbitros (
    partido_id INT,
    arbitro_id INT,
    funcion_id INT,
    PRIMARY KEY (partido_id, arbitro_id),
    FOREIGN KEY (partido_id) REFERENCES partidos(id),
    FOREIGN KEY (arbitro_id) REFERENCES arbitros(id),
    FOREIGN KEY (funcion_id) REFERENCES funciones(id)
);

-- Partido 1: 2ª Aragonesa Masculina entre OLD SCHOOL y REINO DE ARAGÓN
INSERT INTO partidos (dia, hora, categoria_id, equipo_a_id, equipo_b_id, ubicacion, autobus, anotaciones)
VALUES 
    ('2024-11-15', '18:30:00', 1, 1, 2, 'Polideportivo Municipal', 'Líneas 21, 42', 'Partido amistoso');

-- Partido 2: ACB entre CASADEMONT ZARAGOZA y REAL MADRID
INSERT INTO partidos (dia, hora, categoria_id, equipo_a_id, equipo_b_id, ubicacion, autobus, anotaciones)
VALUES 
    ('2024-11-16', '20:00:00', 2, 7, 9, 'Pabellón Príncipe Felipe', 'Líneas 25, 51', 'Partido de liga');

-- Partido 1: Árbitro 3 (funcion_id 1) y Árbitro 2 (funcion_id 4)
INSERT INTO partidos_arbitros (partido_id, arbitro_id, funcion_id)
VALUES 
    (1, 3, 1),
    (1, 2, 4);

-- Partido 2: Árbitro 56 (funcion_id 1) y Árbitro 6 (funcion_id 5)
INSERT INTO partidos_arbitros (partido_id, arbitro_id, funcion_id)
VALUES 
    (2, 56, 1),
    (2, 6, 5);




-- ***********************************************************************************************************************
-- Tabla de "imagen"
CREATE TABLE imagen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    condicion_fisica ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    uniformidad ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    señalizacion ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "arbitro_cola"
CREATE TABLE arbitro_cola (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    colocacion ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    transiciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    rebotes ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    zonas_responsabilidad ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_juego_sin_balon ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_lanzamiento_exterior ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "arbitro_cabeza"
CREATE TABLE arbitro_cabeza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    colocacion ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    transiciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    rebotes ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    zonas_responsabilidad ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_juego_sin_balon ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_lanzamiento_exterior ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "faltas_defensor"
CREATE TABLE faltas_defensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    uso_ilegal_manos_brazos_codos ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    empujones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    verticalidades ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    posicion_legal_defensa ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    accion_continua_accion_tiro ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    simulaciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    f_antideportivas ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    intuiciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    ventaja_desventaja ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "faltas_atacante"
CREATE TABLE faltas_atacante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    uso_ilegal_manos_brazos_codos ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    empujones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    cargas ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    pantallas ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "violaciones"
CREATE TABLE violaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    pasos ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    doble_regate ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    temporales ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    fueras_banda_fondo ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    campo_atras ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    interferencias_interposiciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    tiros_libres ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    pies ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    saques_banda ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    intuiciones ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "criterio_general"
CREATE TABLE criterio_general (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    coherencia ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    consistencia ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    estabilidad_emocional ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "control_partido"
CREATE TABLE control_partido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT,
    f_tecnicas ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    f_descalificantes ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_jugadores ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    control_entrenadores ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL,
    trabajo_equipo ENUM('Muy Bien', 'Bien', 'Suficiente', 'Deficiente', 'Insuficiente') NULL
);

-- Tabla de "valoracion_tecnico"
CREATE TABLE valoracion_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notas TEXT
);

-- Tabla de "informes", relacionando las otras tablas y con referencia al árbitro y al partido
-- Tabla de "informes" actualizada, incluyendo el árbitro evaluado y el evaluador
CREATE TABLE informes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partido_id INT NOT NULL,
    arbitro_id INT NOT NULL,  -- El árbitro que está siendo evaluado
    evaluador_id INT NOT NULL, -- El árbitro que realiza el informe
    imagen_id INT,
    arbitro_cola_id INT,
    arbitro_cabeza_id INT,
    faltas_defensor_id INT,
    faltas_atacante_id INT,
    violaciones_id INT,
    criterio_general_id INT,
    control_partido_id INT,
    valoracion_tecnico_id INT,
    FOREIGN KEY (partido_id) REFERENCES partidos(id),
    FOREIGN KEY (arbitro_id) REFERENCES arbitros(id),  -- Relación con el árbitro evaluado
    FOREIGN KEY (evaluador_id) REFERENCES arbitros(id),  -- Relación con el árbitro evaluador
    FOREIGN KEY (imagen_id) REFERENCES imagen(id),
    FOREIGN KEY (arbitro_cola_id) REFERENCES arbitro_cola(id),
    FOREIGN KEY (arbitro_cabeza_id) REFERENCES arbitro_cabeza(id),
    FOREIGN KEY (faltas_defensor_id) REFERENCES faltas_defensor(id),
    FOREIGN KEY (faltas_atacante_id) REFERENCES faltas_atacante(id),
    FOREIGN KEY (violaciones_id) REFERENCES violaciones(id),
    FOREIGN KEY (criterio_general_id) REFERENCES criterio_general(id),
    FOREIGN KEY (control_partido_id) REFERENCES control_partido(id),
    FOREIGN KEY (valoracion_tecnico_id) REFERENCES valoracion_tecnico(id)
);

ALTER TABLE informes
ADD COLUMN fecha DATE;

-- Inserta en la tabla imagen
INSERT INTO imagen (notas, condicion_fisica, uniformidad, señalizacion)
VALUES ('Buena presentación y actitud', 'Muy Bien', 'Bien', 'Suficiente');

-- Inserta en la tabla arbitro_cola
INSERT INTO arbitro_cola (notas, colocacion, transiciones, rebotes, zonas_responsabilidad, control_juego_sin_balon, control_lanzamiento_exterior)
VALUES ('Sigue bien las jugadas', 'Bien', 'Muy Bien', 'Suficiente', 'Bien', 'Suficiente', 'Bien');

-- Inserta en la tabla arbitro_cabeza
INSERT INTO arbitro_cabeza (notas, colocacion, transiciones, rebotes, zonas_responsabilidad, control_juego_sin_balon, control_lanzamiento_exterior)
VALUES ('Buena colocación en los momentos clave', 'Muy Bien', 'Suficiente', 'Bien', 'Muy Bien', 'Suficiente', 'Suficiente');

-- Inserta en la tabla faltas_defensor
INSERT INTO faltas_defensor (notas, uso_ilegal_manos_brazos_codos, empujones, verticalidades, posicion_legal_defensa, accion_continua_accion_tiro, simulaciones, f_antideportivas, intuiciones, ventaja_desventaja)
VALUES ('Correcto criterio en faltas defensivas', 'Bien', 'Muy Bien', 'Suficiente', 'Bien', 'Suficiente', 'Bien', 'Suficiente', 'Suficiente', 'Bien');

-- Inserta en la tabla faltas_atacante
INSERT INTO faltas_atacante (notas, uso_ilegal_manos_brazos_codos, empujones, cargas, pantallas)
VALUES ('Aplicación adecuada de faltas de ataque', 'Suficiente', 'Bien', 'Muy Bien', 'Suficiente');

-- Inserta en la tabla violaciones
INSERT INTO violaciones (notas, pasos, doble_regate, temporales, fueras_banda_fondo, campo_atras, interferencias_interposiciones, tiros_libres, pies, saques_banda, intuiciones)
VALUES ('Control adecuado de las violaciones', 'Bien', 'Suficiente', 'Muy Bien', 'Bien', 'Suficiente', 'Muy Bien', 'Bien', 'Suficiente', 'Suficiente', 'Bien');

-- Inserta en la tabla criterio_general
INSERT INTO criterio_general (notas, coherencia, consistencia, estabilidad_emocional)
VALUES ('Buen manejo del partido en general', 'Muy Bien', 'Bien', 'Bien');

-- Inserta en la tabla control_partido
INSERT INTO control_partido (notas, f_tecnicas, f_descalificantes, control_jugadores, control_entrenadores, trabajo_equipo)
VALUES ('Buen control de juego, buen trabajo en equipo', 'Bien', 'Suficiente', 'Muy Bien', 'Bien', 'Muy Bien');

-- Inserta en la tabla valoracion_tecnico
INSERT INTO valoracion_tecnico (notas)
VALUES ('Evaluación positiva en términos generales.');

-- Inserta el informe en la tabla informes, vinculando todas las entradas anteriores y los IDs de partido, árbitro y evaluador
INSERT INTO informes (partido_id, arbitro_id, evaluador_id, imagen_id, arbitro_cola_id, arbitro_cabeza_id, faltas_defensor_id, faltas_atacante_id, violaciones_id, criterio_general_id, control_partido_id, valoracion_tecnico_id)
VALUES (
    2,  -- ID del partido
    56, -- ID del árbitro evaluado
    5,  -- ID del árbitro evaluador
    LAST_INSERT_ID(), -- ID de imagen
    LAST_INSERT_ID(), -- ID de arbitro_cola
    LAST_INSERT_ID(), -- ID de arbitro_cabeza
    LAST_INSERT_ID(), -- ID de faltas_defensor
    LAST_INSERT_ID(), -- ID de faltas_atacante
    LAST_INSERT_ID(), -- ID de violaciones
    LAST_INSERT_ID(), -- ID de criterio_general
    LAST_INSERT_ID(),     -- ID de control_partido
    LAST_INSERT_ID()  -- ID de valoracion_tecnico
);



CREATE TABLE tarifas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    funcion_id INT NOT NULL,
    importe DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_funcion FOREIGN KEY (funcion_id) REFERENCES funciones(id) ON DELETE CASCADE,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    UNIQUE (funcion_id, categoria_id)
);

INSERT INTO tarifas (categoria_id, funcion_id, importe) VALUES
-- ACB
(38, 5, 86), 
(38, 6, 86), 
(38, 8, 26),
-- LIGA FEM
(39, 4, 48),
(39, 5, 48),
(39, 6, 48),
(39, 7, 48),
(39, 8, 17),
-- 2ª FEB
(40, 4, 48),
(40, 5, 48),
(40, 6, 48),
(40, 7, 48),
(40, 8, 17),
-- LIGA FEM 2
(41, 4, 31.2),
(41, 5, 31.2),
(41, 6, 31.2),
(41, 7, 31.2),
(41, 8, 14),
-- 3ª FEB
(42, 4, 29.12),
(42, 5, 29.12),
(42, 6, 29.12),
(42, 7, 29.12),
(42, 8, 14),
-- COPA ESPAÑA
(43, 4, 50),
(43, 5, 50),
(43, 6, 50),
(43, 7, 50),
(43, 8, 19),
-- SILLA RUEDAS (1ª DIV)
(44, 4, 20),
(44, 5, 20),
(44, 6, 20),
(44, 8, 20),
-- 1ª MASC A1
(45, 1, 70),
(45, 2, 70),
(45, 4, 25),
(45, 5, 25),
(45, 6, 25),
(45, 8, 18),
-- COPA 1ª MASC
(46, 1, 60),
(46, 2, 60),
(46, 4, 23),
(46, 5, 23),
(46, 6, 23),
(46, 8, 24),
-- 1ª MASC A2
(47, 1, 41.5),
(47, 2, 41.5),
(47, 4, 20.5),
(47, 5, 20.5),
(47, 6, 20.5),
(47, 8, 24),
-- 1ª FEM A1 (Liga Regular)
(48, 1, 41.5),
(48, 2, 41.5),
(48, 4, 21),
(48, 5, 21),
(48, 6, 21),
(48, 8, 17),
-- 1ª FEM A1 (Semis y Final)
(49, 1, 51.5),
(49, 2, 51.5),
(49, 4, 24),
(49, 5, 24),
(49, 6, 24),
(49, 8, 20),
-- COPA 1ª FEM
(50, 1, 41.5),
(50, 2, 41.5),
(50, 4, 21),
(50, 5, 21),
(50, 6, 21),
(50, 8, 17),
-- 1ª FEM A2
(51, 1, 31.5),
(51, 2, 31.5),
(51, 4, 18),
(51, 5, 18),
(51, 6, 18),
(51, 8, 17),
-- 2ª ARAG MASC
(52, 1, 26.5),
(52, 2, 22.5),
(52, 4, 14.5),
(52, 5, 16.5),
(52, 8, 20.5),
-- 2ª ARAG FEM
(53, 1, 24.5),
(53, 2, 18),
(53, 4, 14.5),
(53, 5, 16.5),
(53, 8, 21),
-- 3ª ARAG MASC
(54, 1, 26.5),
(54, 2, 19),
(54, 4, 14.5),
(54, 5, 16.5),
(54, 8, 21),
-- 3ª ARAG FEM
(55, 1, 21.5),
(55, 4, 15),
(55, 8, 18),
-- LIGA SOCIAL
(56, 1, 26),
(56, 4, 16.5),
(56, 8, 17),
-- CTO. ARAGÓN JUNIOR MASC 1ª
(57, 1, 23.5),
(57, 2, 21.5),
(57, 4, 14.5),
(57, 5, 16.5),
(57, 8, 18.5),
-- CTO. ARAGÓN JUNIOR FEM 1ª
(58, 1, 23.5),
(58, 2, 21.5),
(58, 4, 14.5),
(58, 5, 16.5),
(58, 8, 18.5),
-- CTO. ARAGÓN JUNIOR MASC 2ª
(59, 1, 22.5),
(59, 2, 17),
(59, 4, 13),
(59, 5, 15),
(59, 8, 18.5),
-- CTO. ARAGÓN JUNIOR FEM 2ª
(60, 1, 19.5),
(60, 2, 15),
(60, 4, 13),
(60, 5, 15),
(60, 8, 16),
-- CTO. ARAGÓN JUNIOR MASC 3ª
(61, 1, 19.5),
(61, 4, 13.5),
(61, 8, 16),
-- CTO. ARAGÓN JUNIOR FEM 3ª
(62, 1, 19.5),
(62, 4, 13.5),
(62, 8, 16),
-- FINALES CTO. ARAGÓN ESCOLAR
(63, 1, 19.5),
(63, 2, 19.5),
(63, 4, 13.75),
(63, 5, 13.75),
(63, 6, 13.75),
(63, 8, 9.75),
-- CATEG. INFERIORES
(64, 1, 14),
(64, 4, 10.5),
(64, 8, 7.5),
-- ESCUELA
(65, 1, 11.5),
(65, 8, 6),
-- 3x3 SENIOR (cada 20 min)
(67, 1, 7),
(67, 4, 4.5),
(67, 8, 3.5),
-- 3x3 JUNIOR (cada 20 min)
(68, 1, 5.75),
(68, 4, 4),
(68, 8, 3.25),
-- 3x3 ESCOLAR (cada 20 min)
(69, 1, 5),
(69, 4, 3.5),
(69, 8, 1.5),
-- 3x3 SENIOR (cada 25 min)
(70, 1, 8.75),
(70, 4, 5.75),
(70, 8, 4.5),
-- 3x3 JUNIOR (cada 25 min)
(71, 1, 7),
(71, 4, 5),
(71, 8, 4),
-- 3x3 ESCOLAR (cada 25 min)
(72, 1, 6.25),
(72, 4, 4.5),
(72, 8, 1.75);


CREATE TABLE campos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL
);

INSERT INTO campos (nombre, ubicacion) VALUES
('CDM DUQUESA VILLAHERMOSA', 'https://maps.app.goo.gl/Qm8K92GvB1Pk5UxB7'),
('Pab. SANTO DOMINGO', 'https://maps.app.goo.gl/5wQbUSizaL7jNHki8'),
('Pab. LICEO EUROPA', 'https://maps.app.goo.gl/fLDMLQprvoVofQRp7');

ALTER TABLE campos
ADD COLUMN calle TEXT;

UPDATE campos
SET calle = 'Pl. de la Convivencia, 3, Delicias, 50017 Zaragoza'
WHERE nombre = 'CDM DUQUESA VILLAHERMOSA';

UPDATE campos
SET calle = 'P.º Echegaray y Caballero, 74, Casco Antiguo, 50003 Zaragoza'
WHERE nombre = 'Pab. SANTO DOMINGO';

UPDATE campos
SET calle = 'Cam. del Alfaz, 50007 Zaragoza'
WHERE nombre = 'Pab. LICEO EUROPA';
