import api from "./api";

const adminService = {
  addAdmin: (data) => api.post("/lab/admin/add", data),
  activateAdmin: (labId, adminId) => api.patch("/lab/admin/activate", { _id: labId, adminId }),
  deactivateAdmin: (labId, adminId) => api.patch("/lab/admin/deactivate", { _id: labId, adminId }),

  addSupportAdmin: (labId, password, isActive) =>
    api.post("/lab/admin/add/supportAdmin", { _id: labId, password, isActive }),
  activateSupportAdmin: (labId, password) => api.patch("/lab/admin/activate/supportAdmin", { _id: labId, password }),
  deactivateSupportAdmin: (labId) => api.patch("/lab/admin/deactivate/supportAdmin", { _id: labId }),

  deleteAdmin: (labId, adminId) => api.delete("/lab/admin/delete", { data: { _id: labId, adminId: adminId } }),
};

export default adminService;
