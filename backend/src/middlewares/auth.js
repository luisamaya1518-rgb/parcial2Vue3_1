const jwt = require('jsonwebtoken');
const { User, RevokedToken } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const [type, token] = (req.headers.authorization || '').split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ ok: false, message: 'Token requerido' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (await RevokedToken.findByPk(payload.jti)) {
      return res.status(401).json({ ok: false, message: 'Sesión cerrada, inicia sesión de nuevo' });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    req.user = user;
    req.token = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
};