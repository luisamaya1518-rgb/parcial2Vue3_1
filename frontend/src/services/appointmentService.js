import api from './api';

export default {
  listar: (params) => api.get('/appointments', { params }),
  obtener: (id) => api.get(`/appointments/${id}`),
  crear: (data) => api.post('/appointments', data),
  actualizar: (id, data) => api.put(`/appointments/${id}`, data),
  eliminar: (id) => api.delete(`/appointments/${id}`)
};