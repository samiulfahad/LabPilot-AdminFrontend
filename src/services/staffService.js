import api from "./api";

const staffService = {
  addStaff: (data) => api.post("/lab/staff/add", data),
  editStaffAccess: (data) => api.patch("/lab/account/edit", data),
  deactivateStaff: (data) => api.post("/lab/zone/subzone/add", data),
  deleteStaff: (labId, staffId) => api.delete("/lab/staff/delete", { data: { _id: labId, staffId: staffId } }),
};

export default staffService;
