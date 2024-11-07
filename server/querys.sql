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
ADD COLUMN escolar boolean DEFAULT false;

INSERT INTO categorias (nombre) VALUES 
    ('2ª Aragonesa Masculina'),
    ('ACB'),
    ('1ª Femenina A1');

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
