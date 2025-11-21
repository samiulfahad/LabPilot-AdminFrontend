import adminService from "../../../services/adminService";

const adminSlice = (set, get) => ({
  // State
  adminForm: { isActive: false },

  // Actions
  updateAdminForm: (field, value) =>
    set((state) => ({
      adminForm: {
        ...state.adminForm,
        [field]: value,
      },
    })),

  addAdmin: async () => {
    try {
      get().startLoading();

      // 1. Add admin via API
      // console.log(get().selectedLab._id);
      const labId = get().modal.data._id;
      const response = await adminService.addAdmin({ _id: labId, ...get().adminForm });
      const newAdmin = response.data; // The newly created admin

      // 2. Update local state - add to admins array
      set((state) => ({
        labs: state.labs.map((lab) => {
          // Find the lab where this admin should be added
          if (lab._id === labId) {
            return {
              ...lab,
              admins: [...lab.admins, newAdmin],
            };
          }
          return lab;
        }),
        // Clear form after success
        adminForm: { isActive: false },
        popup: { type: "success", message: "Admin added successfully", action: null, data: null },
        modal: { view: null, data: null },
      }));
    } catch (e) {
      let message = "Could not add admin. Please retry";
      if (e.response.data.duplicate) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteAdmin: async () => {
    try {
      get().startLoading();

      const { labId, adminId } = get().popup.data;
      const response = await adminService.deleteAdmin(labId, adminId);

      // Update local state by removing the deleted admin
      set((state) => ({
        labs: state.labs.map((lab) => {
          if (lab._id === labId) {
            return {
              ...lab,
              admins: lab.admins.filter((admin) => admin._id !== adminId),
            };
          }
          return lab;
        }),
        popup: { type: "success", message: "Admin deleted successfully", action: null, data: null },
      }));
    } catch (e) {
      set({ popup: { type: "error", message: "Could not delete admin", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  clearAdminForm: () =>
    set({
      adminForm: { isActive: false },
    }),
});

export default adminSlice;
