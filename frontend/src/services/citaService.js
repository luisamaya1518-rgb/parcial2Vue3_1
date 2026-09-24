import api from './api';

export default {
  listar: (params) => api.get('/citas', { params }),
  obtener: (id) => api.get(`/citas/${id}`),
  crear: (data) => api.post('/citas', data),
  actualizar: (id, data) => api.put(`/citas/${id}`, data),
  eliminar: (id) => api.delete(`/citas/${id}`)
};