/**
 * Controlador de Mascotas
 * @description Maneja las operaciones HTTP de solo lectura para Mascotas
 */

const express = require('express');
const Pet = require('../models/mascotas');
const User = require('../models/User');

class PetController {
       static async getAllPets(req, res) {
  try {
    const pets = await Pet.findAll();

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

    //obtener mascotas de cada usuario
    static async getMyPets(req, res) {
        try {
            const userId = req.user.userId;
            const pets = await Pet.findByOwner(userId);

            res.status(200).json({
                success: true,
                data: pets
            });
        } catch (error) {
            console.error("Error en Pets.getMyPets:", error);
            res.status(500).json({
                success: false,
                message: "Error al obtener datos de las mascotas por usuario."
            });
        }
    }

    // Crear nueva mascota
    static async createPet(req, res) {
        try {
            const { nombre, especie, raza, edad, historial_medico, propietario_id} = req.body;

            if (!nombre || !especie  || !propietario_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre, especie y id propietario son obligatorios.'
                });
            }
            //validación de que el propietario exista
            const user = await User.findById(propietario_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "El propietario no existe"
                });
            }

            const exists = await Pet.existsForOwner(nombre, propietario_id);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe esa mascota con ese nombre'
                });
            }
            const newPet = await Pet.create({nombre, especie, raza, edad, historial_medico, propietario_id});
            res.status(201).json({
                success: true,
                message: 'Mascota creada correctamente',
                data: newPet
            });
        }catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }

//editar mascota
static async updatePet(req, res) {
    try {
        const {id} = req.params;

        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Mascota no encontrada.'
            });
        }

        if (req.body.propietario_id) {
            const user = await User.findById(req.body.propietario_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Propietario no existe.'
                });
            }
        }

        const updatePet = await Pet.update(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Mascota actualizada correctamente',
            data: updatePet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    }
    //eliminar mascota
    static async deletePet(req, res){
        try {
           const {id} = req.params;
           const pet = await Pet.findById(id);
           
           if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Mascota no encontrada.'
            });
           }
           const deletedPet = await Pet.delete(id);
           if (!deletedPet) {
            return res.status(500).json({
                success: false,
                message: 'No se pudo eliminar a la mascota.'
            });
           }
           return res.status(200).json({
            success: true,
            message: 'Mascota eliminada correctamente.'
           });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error interno en el server.'
            });
        }
    }

}


module.exports = PetController;
