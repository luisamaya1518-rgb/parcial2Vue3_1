const { Cita, Doctor } = require('../models');
const { sequelize } = require('../models');

exports.citasPorEstado = async (req, res, next) => {
  try {
    const data = await Cita.findAll({
      attributes: ['estado', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
      group: ['estado']
    });
    res.json({ ok: true, data });
  } catch (err) { next(err); }
};

exports.citasPorDoctor = async (req, res, next) => {
  try {
    const data = await Cita.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('Cita.id')), 'total']],
      include: [{ model: Doctor, attributes: ['id', 'nombre', 'especialidad'] }],
      group: ['Doctor.id']
    });
    res.json({ ok: true, data });
  } catch (err) { next(err); }
};