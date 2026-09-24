const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/pacientes', require('./pacientes'));
router.use('/doctores', require('./doctores'));
router.use('/citas', require('./citas'));
router.use('/reportes', require('./reportes'));

module.exports = router;