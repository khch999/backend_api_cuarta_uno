/**
 * Modelo de Mascotas
 * @description Maneja operaciones de solo lectura para la entidad Mascota
 */

const { pool } = require('../config/database');

class Pet {
    /**
     * Obtiene todas las mascotas con paginación
     * @param {number} page - Número de página (default 1)
     * @param {number} limit - Límite de mascotas por página (default 10)
     * @returns {Promise<Object>} Objeto con mascotas y metadatos de paginación
     */
    static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT id, nombre, especie, raza, edad, historial_medico, propietario_id
         FROM mascotas
         ORDER BY id DESC`
      );
      return rows;
    } catch (error) {
      console.error("Error en Pet.getAll:", error);
      throw new Error("Error al obtener mascotas");
    }
  }

        /**
     * Obtiene la ficha médica de una mascota por id
     * Incluye información del propietario usando la vista `vista_mascotas_propietarios`
     * @param {number} id - ID de la mascota
     * @returns {Promise<Object|null>} Objeto con información de la mascota y propietario
     */
    static async findById(id) {
    try {
        const [rows] = await pool.execute(
            `SELECT *
             FROM vista_mascotas_propietarios
             WHERE id_mascota = ?`,
            [id]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error en Pet.findById:', error);
        throw new Error('Error al obtener mascota por ID.');
    }
    }

    //mascota por id del usuario
    static async getByUserId(userId){
      try {
        const [rows] = await pool.execute(
        `Select id, nombre, raza, especie, edad
        From mascotas
        WHERE propietario_id = ?`,
        [userId]
        );
        return rows;
      } catch (error) {
        console.error('Error en Pet.getByUserId:', error);
        throw new Error('Error al obtener mascotas del usuario');
      }
      
    }
}
module.exports = Pet;
