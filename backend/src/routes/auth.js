const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro, login y sesión
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string, example: Ana Pérez }
 *               email: { type: string, example: ana@correo.com }
 *               password: { type: string, example: Clave1234 }
 *     responses:
 *       201:
 *         description: Usuario creado. Devuelve user y token
 *       409:
 *         description: El email ya existe
 *       422:
 *         description: Datos inválidos
 */
router.post('/register', [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Za-z]/).withMessage('Debe incluir una letra')
    .matches(/\d/).withMessage('Debe incluir un número'),
  validate
], ctrl.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: ana@correo.com }
 *               password: { type: string, example: Clave1234 }
 *     responses:
 *       200:
 *         description: Sesión iniciada. Devuelve user y token
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validate
], ctrl.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión (invalida el token actual)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *       401:
 *         description: No autenticado
 */
router.post('/logout', auth, ctrl.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Usuario autenticado (verificar token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/me', auth, ctrl.me);

module.exports = router;