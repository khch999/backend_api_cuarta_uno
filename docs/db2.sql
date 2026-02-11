-- ===================================================================
-- CREACIÓN BASE DE DATOS
-- ===================================================================
CREATE DATABASE IF NOT EXISTS usuarios_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE usuarios_db;

-- ===================================================================
-- TABLA: usuarios
-- ===================================================================
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nombre (nombre),
    INDEX idx_fecha_creacion (fecha_creacion)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- DATOS USUARIOS
-- ===================================================================
INSERT INTO usuarios (nombre, email, telefono, password) VALUES
('Juan Pérez', 'juan.perez@ejemplo.com', '+52 55 1234-5678', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('María García', 'maria.garcia@ejemplo.com', '+52 55 2345-6789', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Carlos López', 'carlos.lopez@ejemplo.com', '+52 55 3456-7890', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewmVg7BYMzfpcXSO'),
('Ana Martínez', 'ana.martinez@ejemplo.com', '+52 55 4567-8901', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewmVg7BYMzfpcXSO'),
('Luis Rodríguez', 'luis.rodriguez@ejemplo.com', '+52 55 5678-9012', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewmVg7BYMzfpcXSO'),
('Elena Fernández', 'elena.fernandez@ejemplo.com', '+52 55 6789-0123', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewmVg7BYMzfpcXSO'),
('Miguel Torres', 'miguel.torres@ejemplo.com', '+52 55 7890-1234', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Patricia Ruiz', 'patricia.ruiz@ejemplo.com', '+52 55 8901-2345', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Roberto Jiménez', 'roberto.jimenez@ejemplo.com', '+52 55 9012-3456', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Carmen Morales', 'carmen.morales@ejemplo.com', '+52 55 0123-4567', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Admin', 'admin123@gmail.com', '+506 88884986', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW'),
('Kevin', 'kevinhch999@gmail.com', '+506 86189348', '$2a$12$Jaqnh33bUDg2Q1s2cGMjsulJJGCyvjtrI7Pc0jJwJ8LEMpL97FIfW');

-- ===================================================================
-- TABLA: mascotas
-- ===================================================================
DROP TABLE IF EXISTS mascotas;

CREATE TABLE mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(50),
  edad INT,
  historial_medico TEXT,
  propietario_id INT NOT NULL,
  CONSTRAINT fk_mascotas_usuarios
    FOREIGN KEY (propietario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- DATOS MASCOTAS
-- ===================================================================
INSERT INTO mascotas (nombre, especie, raza, edad, historial_medico, propietario_id) VALUES
('Pluto', 'Perro', 'Beagle', 4, 'Vacunado y recuperado de fractura.', 10),
('Astellar', 'Gato', 'Siamés', 7, 'Vacunas y desparasitación al día.', 10),
('Ragnar', 'Gato', 'Bosque de Noruega', 10, 'Control de sobrepeso.', 9),
('Morgan', 'Perro', 'Husky Siberiano', 10, 'Displasia de cadera.', 5),
('Scott', 'Perro', 'Golden labrador', 7, 'Vacunas al día.', 12),
('Milly', 'Loro', 'Nuca amarilla', 10, 'Fractura en un ala.', 7),
('Negro', 'Caballo', 'Pura sangre', 8, 'Castrado y desparasitado.', 6);

-- ===================================================================
-- VISTA USUARIOS
-- ===================================================================
CREATE VIEW vista_usuarios AS
SELECT
    id,
    nombre,
    email,
    telefono,
    DATE_FORMAT(fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_creacion,
    DATE_FORMAT(fecha_actualizacion, '%d/%m/%Y %H:%i') AS fecha_actualizacion
FROM usuarios;

-- ===================================================================
-- VISTA MASCOTAS + PROPIETARIOS
-- ===================================================================
CREATE VIEW vista_mascotas_propietarios AS
SELECT
  m.id AS id_mascota,
  m.nombre AS nombre_mascota,
  m.especie,
  m.raza,
  m.edad,
  m.historial_medico,
  u.id AS id_propietario,
  u.nombre AS nombre_propietario,
  u.email,
  u.telefono
FROM mascotas m
JOIN usuarios u ON m.propietario_id = u.id;

-- ===================================================================
-- CONFIRMACIÓN
-- ===================================================================
SELECT 'BD creada correctamente con usuarios, mascotas y vistas.' AS mensaje;
