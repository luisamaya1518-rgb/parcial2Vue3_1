const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/patients', require('./patients'));
router.use('/doctors', require('./doctors'));
router.use('/appointments', require('./appointments'));
router.use('/reports', require('./reports'));

module.exports = router;