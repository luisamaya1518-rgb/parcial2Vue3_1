const { Paciente, Cita } = require('../models');
const { Op } = require('sequelize');

exports.listar = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.search || '';

    const { rows, count } = await Paciente.findAndCountAll({
      where: search ? { nombre: { [Op.iLike]: `%${search}%` } } : {},
      limit,
      offset: (page - 1) * limit,
      order: [['nombre', 'ASC']]
    });

    res.json({
      ok: true,
      data: rows,
      meta: { total: count, page, pages: Math.ceil(count / limit) }
    });
  } catch (err) { next(err); }
};

exports.obtener = async (req, res, next) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id, { include: Cita });
    if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });
    res.json({ ok: true, data: paciente });
  } catch (err) { next(err); }
};

exports.crear = async (req, res, next) => {
  try {
    const existe = await Paciente.findOne({ where: { email: req.body.email } });
    if (existe) return res.status(409).json({ ok: false, message: 'Ya existe un paciente con ese email' });

    const paciente = await Paciente.create(req.body);
    res.status(201).json({ ok: true, message: 'Paciente creado', data: paciente });
  } catch (err) { next(err); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });

    await paciente.update(req.body);
    res.json({ ok: true, message: 'Paciente actualizado', data: paciente });
  } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });

    const citas = await Cita.count({ where: { paciente_id: paciente.id } });
    if (citas > 0) {
      return res.status(409).json({
        ok: false,
        message: `No se puede eliminar: el paciente tiene ${citas} cita(s) asociada(s)`
      });
    }

    await paciente.destroy();
    res.json({ ok: true, message: 'Paciente eliminado' });
  } catch (err) { next(err); }
};