import labAdminService from "../../../services/labAdminService";

const addAdminSlice = (set, get) => ({
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

  handleAddAdmin: async () => {
    try {
      get().startLoading();

      // 1. Add admin via API
      // console.log(get().selectedLab._id);
      const response = await labAdminService.addAdmin({ _id: get().modalData._id, ...get().adminForm });
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
        popupType: "success",
        popupMessage: "Admin Added successfully",
        activeModal: null,
        modalData: null,
      }));
    } catch (e) {
      set({ popupType: "error", popupMessage: "Could not add admin. Please retry" });
    } finally {
      get().stopLoading();
    }
  },

  clearAdminForm: () =>
    set({
      adminForm: {},
    }),
});

export default addAdminSlice;
