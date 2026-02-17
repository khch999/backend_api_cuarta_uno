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
    static async findAll() { ///antes era getAll
    try {
      const [rows] = await pool.execute(
        `SELECT id, nombre, especie, raza, edad, historial_medico, propietario_id
         FROM mascotas
         ORDER BY id DESC`
      );
      return rows;
    } catch (error) {
      console.error("Error en Pet.findAll:", error);
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
    static async findByOwner(ownerId){ //antes era getByUserId(userId)
      try {
        const [rows] = await pool.execute(
        `Select id, nombre, raza, especie, edad
        From mascotas
        WHERE propietario_id = ?`,
        [ownerId]
        );
        return rows;
      } catch (error) {
        console.error('Error en Pet.findByOwner:', error);
        throw new Error('Error al obtener mascotas del usuario');
      }      
    }

    static async existsForOwner(nombre, propietario_id) {
      try {
        const [rows] = await pool.execute(
          `SELECT id FROM mascotas WHERE nombre = ? AND propietario_id = ?`,
          [nombre, propietario_id]
        );
        return rows.length > 0;
      } catch (error) {
        console.log('Error en Pet.existsForOwner', error);
        throw new Error('Error al verificar mascota existente');
      }
    }

    //crear mascota
    static async create(petData) {
      try {
        const {nombre, especie, raza, edad, historial_medico, propietario_id} = petData;

        const [result] = await pool.execute(
          `INSERT INTO mascotas (nombre, especie, raza, edad, historial_medico, propietario_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [nombre, especie, raza, edad, historial_medico, propietario_id]);

        return await this.findById(result.insertId); 
      } catch (error) {
        console.error("Error en Pet.create:", error);
        if(error.code === 'ER_DUP_ENTRY'){
          throw new Error("La mascota ya existe para este propietario.");
        } 
        throw new Error("Error al crear mascota.");       
      }
    }

    //actualizar mascota
    static async update(id, petData) {
      try {
        const {nombre, especie, raza, edad, historial_medico} = petData;

        const [result] = await pool.execute(
          `UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, historial_medico = ?
          WHERE id = ?`, [nombre, especie, raza, edad, historial_medico, id]
        );
      if (result.affectedRows === 0) {
        return null;
      }
      return await this.findById(id);
      } catch (error) {
        console.log('Error en pet.Update:',error);
        throw new Error('Error al actualizar mascota.');
      }      
    }
    //eliminar mascota
    static async delete(id) {
      try {
        const [result] = await pool.execute(`DELETE FROM mascotas WHERE id = ?`,
          [id]
        );
        return result.affectedRows > 0;
      } catch (error) {
        console.log('Error en Pet.delete:', error);
        throw new Error('Error al eliminar mascotas.');
      }
    }


}
module.exports = Pet;
