import api from "./api";

const zoneService = {
  getZones: () => api.get("/lab/zone/all"),
  addZone: (data) => api.post("/lab/zone/add", data),
  editZone: (data) => api.patch("/lab/zone/edit", data),
  deleteZone: (_id) => api.delete("/lab/zone/delete", { data: { zoneId: _id } }),
  addSubZone: (data) => api.post("/lab/zone/subzone/add", data),
  editSubZone: (data) => api.patch("/lab/zone/subzone/edit", data),
  deleteSubZone: (zoneId, subZoneId) => api.delete("/lab/zone/subzone/delete", { data: { zoneId, subZoneId } }),
};

export default zoneService;
