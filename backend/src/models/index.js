const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  twoFactorSecret: { type: DataTypes.STRING },
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'users' });

const Paciente = sequelize.define('Paciente', {
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING(30) },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  historial_medico: { type: DataTypes.TEXT }
}, { tableName: 'pacientes' });

const Doctor = sequelize.define('Doctor', {
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  especialidad: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(30) },
  cualificaciones: { type: DataTypes.TEXT }
}, { tableName: 'doctores' });

const Cita = sequelize.define('Cita', {
  fecha_cita: { type: DataTypes.DATE, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'completada', 'cancelada'),
    defaultValue: 'pendiente'
  },
  notas: { type: DataTypes.TEXT }
}, { tableName: 'citas' });

const RevokedToken = sequelize.define('RevokedToken', {
  jti: { type: DataTypes.STRING, primaryKey: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'revoked_tokens', timestamps: false });

Paciente.hasMany(Cita, { foreignKey: { name: 'paciente_id', allowNull: false }, onDelete: 'RESTRICT' });
Cita.belongsTo(Paciente, { foreignKey: 'paciente_id' });

Doctor.hasMany(Cita, { foreignKey: { name: 'doctor_id', allowNull: false }, onDelete: 'RESTRICT' });
Cita.belongsTo(Doctor, { foreignKey: 'doctor_id' });

module.exports = { sequelize, User, Paciente, Doctor, Cita, RevokedToken };