import api from './api';

const zoneService = {
  getZones: () => api.get('/zone/all'),
  addZone: (data) => api.post('/zone/add', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
};

export default zoneService