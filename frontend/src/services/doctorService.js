import api from './api';

export default {
  listar: (params) => api.get('/doctors', { params }),
  obtener: (id) => api.get(`/doctors/${id}`),
  crear: (data) => api.post('/doctors', data),
  actualizar: (id, data) => api.put(`/doctors/${id}`, data),
  eliminar: (id) => api.delete(`/doctors/${id}`)
};