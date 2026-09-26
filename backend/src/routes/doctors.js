const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/doctor.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const reglas = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('especialidad').trim().notEmpty().withMessage('La especialidad es obligatoria'),
  body('telefono').optional().isString(),
  body('cualificaciones').optional().isString()
];

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Doctores
 *   description: CRUD de doctores
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Listar doctores
 *     tags: [Doctores]
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
 *       200: { description: Lista paginada de doctores }
 *   post:
 *     summary: Crear doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, especialidad]
 *             properties:
 *               nombre: { type: string, example: Dra. López }
 *               email: { type: string, example: lopez@clinica.com }
 *               especialidad: { type: string, example: Pediatría }
 *               telefono: { type: string, example: "70000001" }
 *               cualificaciones: { type: string, example: Médico general, UES }
 *     responses:
 *       201: { description: Doctor creado }
 *       409: { description: Email duplicado }
 *       422: { description: Datos inválidos }
 */
router.get('/', ctrl.listar);
router.post('/', reglas, validate, ctrl.crear);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Obtener un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor encontrado }
 *       404: { description: No encontrado }
 *   put:
 *     summary: Actualizar un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor actualizado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Eliminar un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor eliminado }
 *       404: { description: No encontrado }
 *       409: { description: Tiene citas asociadas }
 */
router.get('/:id', param('id').isInt(), validate, ctrl.obtener);
router.put('/:id', [param('id').isInt(), ...reglas.map(r => r.optional()), validate], ctrl.actualizar);
router.delete('/:id', param('id').isInt(), validate, ctrl.eliminar);

module.exports = router;