const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, RevokedToken } = require('../models');

const signToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '2h',
    jwtid: crypto.randomUUID()
  });

const publicUser = (u) => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  twoFactorEnabled: u.twoFactorEnabled
});

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({ ok: false, message: 'El email ya está registrado' });
    }

    const user = await User.create({
      nombre,
      email,
      password: await bcrypt.hash(password, 10)
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado',
      data: { user: publicUser(user), token: signToken(user) }
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas' });
    }

    res.json({
      ok: true,
      message: 'Sesión iniciada',
      data: { user: publicUser(user), token: signToken(user) }
    });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await RevokedToken.create({
      jti: req.token.jti,
      expiresAt: new Date(req.token.exp * 1000)
    });
    res.json({ ok: true, message: 'Sesión cerrada' });
  } catch (err) { next(err); }
};

exports.me = (req, res) => {
  res.json({ ok: true, data: { user: publicUser(req.user) } });
};