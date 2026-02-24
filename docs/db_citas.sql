CREATE TABLE citas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado ENUM('pendiente','confirmada','cancelada') DEFAULT 'pendiente',
    mascota_id INT NOT NULL,
    propietario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unica_fecha_hora UNIQUE (fecha, hora),

    FOREIGN KEY mascota_id(id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY propietario_id(id) REFERENCES usuarios(id) ON DELETE CASCADE 
);