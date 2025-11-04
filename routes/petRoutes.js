const express = require('express');
const router = express.Router();
const PetController = require('../controllers/petController');
const {validatePetId} = require('../middleware/validation');

/**
 * @route GET /pets
 * @description Obtiene todas las mascotas con paginación opcional
 * @param {number} [page=1] - Número de página
 * @param {number} [limit=10] - Límite de mascotas por página
 * @returns {Object} Lista de mascotas con datos de propietario
 */
router.get('/', PetController.getAllPets);

/**
 * @route GET /pets/:id
 * @description Obtiene la ficha médica de una mascota específica
 * @access Public
 */
router.get('/:id', PetController.getPetMedicalPage);

module.exports = router;