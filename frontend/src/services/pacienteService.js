import api from './api';

export default {
  listar: (params) => api.get('/pacientes', { params }),
  obtener: (id) => api.get(`/pacientes/${id}`),
  crear: (data) => api.post('/pacientes', data),
  actualizar: (id, data) => api.put(`/pacientes/${id}`, data),
  eliminar: (id) => api.delete(`/pacientes/${id}`)
};