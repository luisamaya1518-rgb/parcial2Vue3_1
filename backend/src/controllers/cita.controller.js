const { Cita, Paciente, Doctor } = require('../models');
const { Op } = require('sequelize');

const include = [
  { model: Paciente, attributes: ['id', 'nombre', 'email'] },
  { model: Doctor, attributes: ['id', 'nombre', 'especialidad'] }
];

exports.listar = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const where = {};
    if (req.query.estado) where.estado = req.query.estado;
    if (req.query.doctor_id) where.doctor_id = req.query.doctor_id;
    if (req.query.paciente_id) where.paciente_id = req.query.paciente_id;

    const { rows, count } = await Cita.findAndCountAll({
      where, include, limit, offset: (page - 1) * limit,
      order: [['fecha_cita', 'ASC']]
    });

    res.json({ ok: true, data: rows, meta: { total: count, page, pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.obtener = async (req, res, next) => {
  try {
    const cita = await Cita.findByPk(req.params.id, { include });
    if (!cita) return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
    res.json({ ok: true, data: cita });
  } catch (err) { next(err); }
};

// Valida existencia de paciente/doctor y que no haya choque de horario
const validarNegocio = async ({ paciente_id, doctor_id, fecha_cita }, citaIdExcluir = null) => {
  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) return 'El paciente indicado no existe';

  const doctor = await Doctor.findByPk(doctor_id);
  if (!doctor) return 'El doctor indicado no existe';

  if (new Date(fecha_cita) < new Date()) return 'La fecha de la cita no puede ser en el pasado';

  const where = {
    doctor_id,
    fecha_cita,
    estado: { [Op.ne]: 'cancelada' }
  };
  if (citaIdExcluir) where.id = { [Op.ne]: citaIdExcluir };

  const choque = await Cita.findOne({ where });
  if (choque) return 'El doctor ya tiene una cita agendada en ese horario';

  return null;
};

exports.crear = async (req, res, next) => {
  try {
    const error = await validarNegocio(req.body);
    if (error) return res.status(422).json({ ok: false, message: error });

    const cita = await Cita.create(req.body);
    const creada = await Cita.findByPk(cita.id, { include });
    res.status(201).json({ ok: true, message: 'Cita creada', data: creada });
  } catch (err) { next(err); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ ok: false, message: 'Cita no encontrada' });

    if (req.body.paciente_id || req.body.doctor_id || req.body.fecha_cita) {
      const error = await validarNegocio({
        paciente_id: req.body.paciente_id ?? cita.paciente_id,
        doctor_id: req.body.doctor_id ?? cita.doctor_id,
        fecha_cita: req.body.fecha_cita ?? cita.fecha_cita
      }, cita.id);
      if (error) return res.status(422).json({ ok: false, message: error });
    }

    await cita.update(req.body);
    const actualizada = await Cita.findByPk(cita.id, { include });
    res.json({ ok: true, message: 'Cita actualizada', data: actualizada });
  } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ ok: false, message: 'Cita no encontrada' });

    await cita.destroy();
    res.json({ ok: true, message: 'Cita eliminada' });
  } catch (err) { next(err); }
};