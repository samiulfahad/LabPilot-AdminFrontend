import adminService from "../../../services/adminService";

const adminSlice = (set, get) => ({
  // State
  adminForm: {},

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
      const response = await adminService.addAdmin({ _id: get().modalData._id, ...get().adminForm });
      const newAdmin = response.data; // The newly created admin

      // 2. Update local state - add to admins array
      set((state) => ({
        labs: state.labs.map((lab) => {
          // Find the lab where this admin should be added
          // You might need to use get().selectedLab or another way to identify the target lab
          if (lab._id === state.modalData?._id) {
            return {
              ...lab,
              admins: [...lab.admins, newAdmin],
            };
          }
          return lab;
        }),
        // Clear form after success
        adminForm: {},
        popup: "success",
        popupMessage: "Admin Added successfully",
        activeModal: null,
        modalData: null,
      }));
    } catch (e) {
      let message = "Could not add admin. Please retry";
      if(e.response.data.duplicate){
        message = e.response.data.message
      }
      set({ popup: "error", popupMessage: message, popupData: null });
    } finally {
      get().stopLoading();
    }
  },

  deleteAdmin: async () => {
    try {
      get().startLoading();

      const { labId, adminId } = get().popupData;
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
        popup: "success",
        popupMessage: "Staff deleted successfully",
        popupData: null,
      }));

      console.log(response);
    } catch (e) {
      set({
        popupType: "error",
        popupMessage: "Could not delete staff. Please retry",
      });
    } finally {
      get().stopLoading();
    }
  },

  clearAdminForm: () =>
    set({
      adminForm: {},
    }),
});

export default adminSlice;
