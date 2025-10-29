import api from "./api";

const zoneService = {
  getZones: () => api.get("/zone/all"),
  addZone: (data) => api.post("/zone/add", data),
  editZone: (data) => api.patch("/zone/edit", data),
  deleteZone: (_id) => api.delete("/zone/delete", { data: { zoneId: _id } }),
  addSubZone: (data) => api.post("/zone/subzone/add", data),
  editSubZone: (data) => api.patch("/zone/subzone/edit", data),
  deleteSubZone: (zoneId, subZoneId) => api.delete("/zone/subzone/delete", { data: { zoneId, subZoneId } }),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
};

export default zoneService;
