/**
 * Controlador de Mascotas
 * @description Maneja las operaciones HTTP de solo lectura para Mascotas
 */

const Pet = require('../models/mascotas');

class PetController {
       static async getAllPets(req, res) {
  try {
    const pets = await Pet.getAll();

    if (!pets || pets.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No hay mascotas registradas."
      });
    }

    res.status(200).json({
      success: true,
      data: pets
    });
  } catch (error) {
    console.error("Error en getAllPets:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener mascotas"
    });
  }
  }

    /**
     * Obtiene la ficha médica de una mascota específica
     * @param {Object} req 
     * @param {Object} res 
     */
    static async getPetMedicalPage(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número válido'
                });
            }

            const data = await Pet.findById(id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Ficha médica obtenida correctamente',
                data: data
            });
        } catch (error) {
            console.error('Error en getPetMedicalPage:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Crear nueva mascota
    static async createPet(req, res) {
        try {
            const { nombre, especie, raza, edad, historial_medico, propietario_id } = req.body;

            const newPet = await Pet.create({ nombre, especie, raza, edad, historial_medico, propietario_id });

            res.status(201).json({ success: true,
                 message: 'Mascota creada correctamente', 
                 data: newPet });
        } catch (error) {
            res.status(400).json({ success: false,
                 message: error.message });
        }
    }

/**
     * evitar duplicados de una mascota en un mismo propietario
     * @param {Object} req 
     * @param {Object} res 
     */
    static async existsForOwner(nombre, propietario_id) {
    try {
        const [rows] = await pool.execute(
            'SELECT id FROM mascotas WHERE nombre = ? AND propietario_id = ?',
            [nombre, propietario_id]
        );
        return rows.length > 0; // true si ya existe
    } catch (error) {
        console.error('Error en Pet.existsForOwner:', error);
        throw new Error('Error al verificar mascota existente');
    }
}
}


module.exports = PetController;
