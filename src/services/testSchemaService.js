import api from "./api";

const testSchemaService = {
  getAll: (params) => api.get("/test/schema/all", { params }),
  addNew: (data) => api.post("/test/schema/add", data),
  editLab: (data) => api.patch("/lab/account/edit", data),
  deleteLab: (_id) => api.delete("/lab/account/delete", { data: { _id: _id } }),
  deactivateLab: (_id) => api.patch("/lab/account/deactivate", { _id: _id }),
  activateLab: (_id) => api.patch("/lab/account/activate", { _id: _id }),
};

export default testSchemaService
