import api from "./api";

const adminService = {
  addAdmin: (data) => api.post("/lab/admin/add", data),
  deleteAdmin: (labId, adminId) => api.delete("/lab/admin/delete", { data: { _id: labId, adminId: adminId } }),
};

export default adminService;
