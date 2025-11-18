import api from "./api";

const labService = {
  getLabs: (params) => api.get("/lab/account/all", { params }),
  addLab: (data) => api.post("/lab/account/add", data),
  editLab: (data) => api.patch("/lab/account/edit", data),
  deleteLab: (_id) => api.delete("/lab/account/delete", { data: { _id: _id } })
};

export default labService;
