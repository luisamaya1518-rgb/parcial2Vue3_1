const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return res.status(422).json({
    ok: false,
    message: 'Datos inválidos',
    errors: result.array().map(e => ({ campo: e.path, mensaje: e.msg }))
  });
};