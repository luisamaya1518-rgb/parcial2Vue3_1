import api from './api';

export default {
  listar: (params) => api.get('/doctores', { params }),
  obtener: (id) => api.get(`/doctores/${id}`),
  crear: (data) => api.post('/doctores', data),
  actualizar: (id, data) => api.put(`/doctores/${id}`, data),
  eliminar: (id) => api.delete(`/doctores/${id}`)
};