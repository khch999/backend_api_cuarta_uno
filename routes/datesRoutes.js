const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');
const {authenticateToken} = require('../middleware/auth');


/**
 * @route GET /dates
 * @description Obtiene todas las citas agendadas
 * @returns {Object} Lista de citas agendadas
 */
router.get('/', CitaController.getAllDates);

/**
 * @route GET /dates/my
 * @description Obtiene todas las citas de un usuario para su mascota
 * @returns {Object} Lista de citas por propietario
 */
router.get('/my', authenticateToken, CitaController.getMyDates);

/**
 * @route GET /dates/available
 * @description Obtiene las fechas disponibles
 * @returns {Object} fechas disponibles
 */
router.get('/available', CitaController.getAvailableHours);

/**
 * @route POST /dates/
 * @description Crea y asigna una nueva cita a la mascota de un usuario
 * @access No Public
 */
router.post('/', authenticateToken, CitaController.createDate);

/**
 * @route PATCH /dates/:id/cancel
 * @description cancela la cita
 * @access No Public
 */
router.patch('/:id/cancel', authenticateToken, CitaController.cancelDate);

/**
 * @route PATCH /dates/:id/state
 * @description actualiza el estado de una cita
 * @access No Public
 */
router.patch('/:id/state', authenticateToken, CitaController.updateStatusDate);

module.exports = router;