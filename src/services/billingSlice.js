import api from "./api";

const billingService = {
  addStaff: (data) => api.post("/lab/staff/add", data),
  activateStaff: (labId, staffId) => api.patch("/lab/staff/activate", { _id: labId, staffId }),
  deactivateStaff: (labId, staffId) => api.patch("/lab/staff/deactivate", {_id: labId, staffId}),
  editStaffAccess: (data) => api.patch("/lab/staff/edit", data),
  deleteStaff: (labId, staffId) => api.delete("/lab/staff/delete", { data: { _id: labId, staffId: staffId } }),
};

export default billingService;
