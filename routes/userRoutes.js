/**
 * Rutas de Usuarios
 * @description Define todas las rutas REST para la gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../middleware/validation');
const {authenticateToken, authorizeRoles} = require('../middleware/auth');

/**
 * @route GET /users
 * @description Obtiene todos los usuarios con paginación opcional
 * @access Public
 * @param {number} [page=1] - Número de página
 * @param {number} [limit=10] - Límite de usuarios por página
 * @param {string} [search] - Término de búsqueda por nombre
 * @returns {Object} Lista de usuarios con metadatos de paginación
 */
router.get('/', UserController.getAllUsers);

/**
 * @route GET /users/search
 * @description Busca usuarios por nombre
 * @access Private (admin, owner)
 * @param {string} q - Término de búsqueda (query parameter)
 * @returns {Object} Lista de usuarios que coinciden con la búsqueda
 */
router.get('/search', authenticateToken, authorizeRoles('admin','owner'), UserController.searchUsers);

/**
 * @route GET /users/stats
 * @description Obtiene estadísticas de usuarios
 * @access Private (admin)
 * @returns {Object} Estadísticas del sistema de usuarios
 */
router.get('/stats', authenticateToken, authorizeRoles('admin'), UserController.getUserStats);

/**
 * @route GET /users/:id
 * @description Obtiene un usuario específico por ID
 * @access Private (admin, owner)
 * @param {number} id - ID del usuario
 * @returns {Object} Datos del usuario solicitado
 */
router.get('/:id', authenticateToken, authorizeRoles('admin','owner'), validateUserId, UserController.getUserById);

/**
 * @route POST /users
 * @description Crea un nuevo usuario
 * @access Private (admin)
 * @body {string} nombre - Nombre completo del usuario (requerido)
 * @body {string} email - Email único del usuario (requerido)
 * @body {string} telefono - Número de teléfono del usuario (requerido)
 * @returns {Object} Usuario creado
 */
router.post('/', authenticateToken, authorizeRoles('admin'), validateUser, UserController.createUser);

/**
 * @route PUT /users/:id
 * @description Actualiza un usuario existente
 * @access Private (admin)
 * @param {number} id - ID del usuario a actualizar
 * @body {string} nombre - Nombre completo del usuario (requerido)
 * @body {string} email - Email único del usuario (requerido)
 * @body {string} telefono - Número de teléfono del usuario (requerido)
 * @returns {Object} Usuario actualizado
 */
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateUserId, validateUser, UserController.updateUser);

/**
 * @route DELETE /users/:id
 * @description Elimina un usuario
 * @access Private (admin)
 * @param {number} id - ID del usuario a eliminar
 * @returns {Object} Mensaje de confirmación
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), validateUserId, UserController.deleteUser);

module.exports = router;