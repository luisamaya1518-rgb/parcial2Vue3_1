const router = require('express').Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/appointment.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const reglas = [
  body('paciente_id').isInt().withMessage('paciente_id es obligatorio'),
  body('doctor_id').isInt().withMessage('doctor_id es obligatorio'),
  body('fecha_cita').isISO8601().withMessage('Fecha/hora inválida (formato ISO 8601)'),
  body('estado').optional().isIn(['pendiente', 'confirmada', 'completada', 'cancelada']),
  body('notas').optional().isString()
];

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: CRUD de citas
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar citas
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: estado
 *         schema: { type: string }
 *       - in: query
 *         name: doctor_id
 *         schema: { type: integer }
 *       - in: query
 *         name: paciente_id
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista paginada de citas }
 *   post:
 *     summary: Crear cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paciente_id, doctor_id, fecha_cita]
 *             properties:
 *               paciente_id: { type: integer, example: 1 }
 *               doctor_id: { type: integer, example: 1 }
 *               fecha_cita: { type: string, example: "2026-10-01T09:00:00" }
 *               notas: { type: string, example: Control anual }
 *     responses:
 *       201: { description: Cita creada }
 *       422: { description: Datos inválidos, fecha pasada o choque de horario }
 */
router.get('/', [query('page').optional().isInt(), validate], ctrl.listar);
router.post('/', reglas, validate, ctrl.crear);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita encontrada }
 *       404: { description: No encontrada }
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita actualizada }
 *       404: { description: No encontrada }
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita eliminada }
 *       404: { description: No encontrada }
 */
router.get('/:id', param('id').isInt(), validate, ctrl.obtener);
router.put('/:id', [param('id').isInt(), ...reglas.map(r => r.optional()), validate], ctrl.actualizar);
router.delete('/:id', param('id').isInt(), validate, ctrl.eliminar);

module.exports = router;