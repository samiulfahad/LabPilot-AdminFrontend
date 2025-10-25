import api from './api';

const zoneService = {
  getZones: () => api.get('/zone/all'),
  addZone: (data) => api.post('/zone/add', data),
  editZone: (data) => api.patch('/zone/edit', data),
  deleteZone: (_id) =>  api.delete('/zone/delete', { data: {zoneId: _id}}),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
};

export default zoneService