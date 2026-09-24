const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/paciente.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const reglas = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('telefono').optional().isString(),
  body('fecha_nacimiento').isISO8601().withMessage('Fecha inválida (usa YYYY-MM-DD)')
    .custom(v => new Date(v) < new Date()).withMessage('La fecha de nacimiento debe ser en el pasado'),
  body('historial_medico').optional().isString()
];

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: CRUD de pacientes
 */

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Listar pacientes
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista paginada de pacientes }
 *   post:
 *     summary: Crear paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, fecha_nacimiento]
 *             properties:
 *               nombre: { type: string, example: Juan Torres }
 *               email: { type: string, example: juan@correo.com }
 *               telefono: { type: string, example: "70000000" }
 *               fecha_nacimiento: { type: string, example: "1995-05-20" }
 *               historial_medico: { type: string, example: Ninguno relevante }
 *     responses:
 *       201: { description: Paciente creado }
 *       409: { description: Email duplicado }
 *       422: { description: Datos inválidos }
 */
router.get('/', ctrl.listar);
router.post('/', reglas, validate, ctrl.crear);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente encontrado }
 *       404: { description: No encontrado }
 *   put:
 *     summary: Actualizar un paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente actualizado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Eliminar un paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente eliminado }
 *       404: { description: No encontrado }
 *       409: { description: Tiene citas asociadas }
 */
router.get('/:id', param('id').isInt(), validate, ctrl.obtener);
router.put('/:id', [param('id').isInt(), ...reglas.map(r => r.optional()), validate], ctrl.actualizar);
router.delete('/:id', param('id').isInt(), validate, ctrl.eliminar);

module.exports = router;