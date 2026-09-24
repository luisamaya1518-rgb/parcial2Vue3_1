import api from './api';

export default {
  citasPorEstado: () => api.get('/reportes/citas-por-estado'),
  citasPorDoctor: () => api.get('/reportes/citas-por-doctor')
};