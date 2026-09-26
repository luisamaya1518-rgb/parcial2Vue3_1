const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/contact.controller');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Contacto
 *   description: Formulario de contacto público
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mensaje]
 *             properties:
 *               email: { type: string, example: persona@correo.com }
 *               mensaje: { type: string, example: Quisiera información sobre citas disponibles }
 *     responses:
 *       200: { description: Mensaje enviado }
 *       422: { description: Datos inválidos }
 *       500: { description: Error al enviar el correo }
 */
router.post('/', [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio')
    .isLength({ max: 1000 }).withMessage('Máximo 1000 caracteres'),
  validate
], ctrl.enviar);

module.exports = router;