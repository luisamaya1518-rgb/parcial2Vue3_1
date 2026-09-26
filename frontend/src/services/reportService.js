import api from './api';

export default {
  citasPorEstado: () => api.get('/reports/appointments-by-status'),
  citasPorDoctor: () => api.get('/reports/appointments-by-doctor')
};
