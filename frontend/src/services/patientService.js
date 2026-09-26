import api from './api';

export default {
  listar: (params) => api.get('/patients', { params }),
  obtener: (id) => api.get(`/patients/${id}`),
  crear: (data) => api.post('/patients', data),
  actualizar: (id, data) => api.put(`/patients/${id}`, data),
  eliminar: (id) => api.delete(`/patients/${id}`)
};