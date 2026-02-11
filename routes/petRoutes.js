const express = require('express');
const router = express.Router();
const PetController = require('../controllers/petController');
const {validatePetId} = require('../middleware/validation');
const {authenticateToken} = require('../middleware/auth');

/**
 * @route GET /pets/my
 * @description Obtiene todas las mascotas de un usuario específico por su id
 * @returns {Object} Lista de mascotas por propietario
 */
router.get('/my', authenticateToken, PetController.getMyPets);

/**
 * @route GET /pets/:id
 * @description Obtiene la ficha médica de una mascota específica
 * @access Public
 */
router.get('/:id', PetController.getPetMedicalPage);

/**
 * @route GET /pets
 * @description Obtiene todas las mascotas con paginación opcional
 * @param {number} [page=1] - Número de página
 * @param {number} [limit=10] - Límite de mascotas por página
 * @returns {Object} Lista de mascotas con datos de propietario
 */
router.get('/', PetController.getAllPets);

module.exports = router;