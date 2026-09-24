const { Doctor, Cita } = require('../models');
const { Op } = require('sequelize');

exports.listar = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.search || '';

    const { rows, count } = await Doctor.findAndCountAll({
      where: search ? {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { especialidad: { [Op.iLike]: `%${search}%` } }
        ]
      } : {},
      limit,
      offset: (page - 1) * limit,
      order: [['nombre', 'ASC']]
    });

    res.json({ ok: true, data: rows, meta: { total: count, page, pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.obtener = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, { include: Cita });
    if (!doctor) return res.status(404).json({ ok: false, message: 'Doctor no encontrado' });
    res.json({ ok: true, data: doctor });
  } catch (err) { next(err); }
};

exports.crear = async (req, res, next) => {
  try {
    const existe = await Doctor.findOne({ where: { email: req.body.email } });
    if (existe) return res.status(409).json({ ok: false, message: 'Ya existe un doctor con ese email' });

    const doctor = await Doctor.create(req.body);
    res.status(201).json({ ok: true, message: 'Doctor creado', data: doctor });
  } catch (err) { next(err); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ ok: false, message: 'Doctor no encontrado' });

    await doctor.update(req.body);
    res.json({ ok: true, message: 'Doctor actualizado', data: doctor });
  } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ ok: false, message: 'Doctor no encontrado' });

    const citas = await Cita.count({ where: { doctor_id: doctor.id } });
    if (citas > 0) {
      return res.status(409).json({
        ok: false,
        message: `No se puede eliminar: el doctor tiene ${citas} cita(s) asociada(s)`
      });
    }

    await doctor.destroy();
    res.json({ ok: true, message: 'Doctor eliminado' });
  } catch (err) { next(err); }
};