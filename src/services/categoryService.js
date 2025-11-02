import api from "./api";

const categoryService = {
  getCategories: () => api.get("/category/all"),
  addCategory: (data) => api.post("/category/add", data),
  editLab: (data) => api.patch("/lab/edit", data),
  deleteLab: (_id) => api.delete("/lab/delete", { data: { _id: _id } }),
  addSubZone: (data) => api.post("/zone/subzone/add", data),
  editSubZone: (data) => api.patch("/zone/subzone/edit", data),
  deleteSubZone: (zoneId, subZoneId) => api.delete("/zone/subzone/delete", { data: { zoneId, subZoneId } }),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
};

export default categoryService;
