const router = require('express').Router();
const ctrl = require('../controllers/reporte.controller');
const auth = require('../middlewares/auth');

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Estadísticas de citas
 */

/**
 * @swagger
 * /api/reportes/citas-por-estado:
 *   get:
 *     summary: Conteo de citas agrupadas por estado
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado }
 */
router.get('/citas-por-estado', ctrl.citasPorEstado);

/**
 * @swagger
 * /api/reportes/citas-por-doctor:
 *   get:
 *     summary: Conteo de citas agrupadas por doctor
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado }
 */
router.get('/citas-por-doctor', ctrl.citasPorDoctor);

module.exports = router;