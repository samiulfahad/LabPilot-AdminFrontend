import api from "./api";

const labAdminService = {
  getLabs: (params) => api.get("/lab/account/all", { params }),
  addAdmin: (data) => api.post("/lab/admin/add", data),
  editLab: (data) => api.patch("/lab/account/edit", data),
  deleteLab: (_id) => api.delete("/lab/account/delete", { data: { _id: _id } }),
  addSubZone: (data) => api.post("/lab/zone/subzone/add", data),
  editSubZone: (data) => api.patch("/lab/zone/subzone/edit", data),
  deleteSubZone: (zoneId, subZoneId) => api.delete("/lab/zone/subzone/delete", { data: { zoneId, subZoneId } }),
};

export default labAdminService;
