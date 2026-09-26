const router = require('express').Router();
const ctrl = require('../controllers/report.controller');
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
 * /api/reports/appointments-by-status:
 *   get:
 *     summary: Conteo de citas agrupadas por estado
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado }
 */
router.get('/appointments-by-status', ctrl.citasPorEstado);

/**
 * @swagger
 * /api/reports/appointments-by-doctor:
 *   get:
 *     summary: Conteo de citas agrupadas por doctor
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado }
 */
router.get('/appointments-by-doctor', ctrl.citasPorDoctor);

module.exports = router;