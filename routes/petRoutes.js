const express = require('express');
const router = express.Router();
const PetController = require('../controllers/petController');
const {validatePetId} = require('../middleware/validation');
const {authenticateToken, authorizeRoles} = require('../middleware/auth');

/**
 * @route GET /pets/my
 * @description Obtiene todas las mascotas de un usuario específico por su id
 * @returns {Object} Lista de mascotas por propietario
 */
router.get('/my', authenticateToken, PetController.getMyPets);

/**
 * @route POST /pets/
 * @description Crea y asigna una nueva mascota a un usuario
 * @access No Public
 */
router.post('/', authenticateToken, authorizeRoles('admin') ,PetController.createPet);

/**
 * @route PUT /pets/
 * @description Modifica los datos de una mascota.
 * @access No Public
 */
router.put('/:id', authenticateToken, authorizeRoles('admin') ,PetController.updatePet);

/**
 * @route DELETE /pets/:id
 * @description Elimina una mascota
 * @access No Public
 * @param {number} id - ID del usuario a eliminar
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), PetController.deletePet);

/**
 * @route GET /pets/:id
 * @description Obtiene la ficha médica de una mascota específica
 * @access No Public
 */
router.get('/:id', authenticateToken, PetController.getPetMedicalPage);

/**
 * @route GET /pets
 * @description Obtiene todas las mascotas con paginación opcional
 * @param {number} [page=1] - Número de página
 * @param {number} [limit=10] - Límite de mascotas por página
 * @returns {Object} Lista de mascotas con datos de propietario
 */
router.get('/', PetController.getAllPets);

module.exports = router;