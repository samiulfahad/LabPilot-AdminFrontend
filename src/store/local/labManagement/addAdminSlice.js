import labAdminService from "../../../services/labAdminService";

const formData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  isActive: "",
};

const addAdminSlice = (set, get) => ({
  // State
  adminFormData: { ...formData },
  selectedLab: null,
  popup: null,

  // Actions
  setSelectedLab: (lab) => set({ selectedLab: lab }),
  setPopup: (type) => set({ popup: type }),
  updateAdminFormData: (field, value) =>
    set((state) => ({
      adminFormData: {
        ...state.adminFormData,
        [field]: value,
      },
    })),

  handleAddAdmin: async () => {
    try {
      get().startLoading();

      // 1. Add admin via API
      const response = await labAdminService.addAdmin(get().adminFormData);
      const newAdmin = response.data; // The newly created admin

      // 2. Update local state - add to admins array
      set((state) => ({
        labs: state.labs.map((lab) => {
          // Find the lab where this admin should be added
          // You might need to use get().selectedLab or another way to identify the target lab
          if (lab._id === state.selectedLab?._id) {
            return {
              ...lab,
              admins: [...lab.admins, newAdmin],
            };
          }
          return lab;
        }),
        // Clear form after success
        adminFormData: { ...formData },
        selectedLab: null,
        popup: "success",
      }));
    } catch (e) {
      set({ error: "Could not add admin", popup: "error" });
    } finally {
      get().stopLoading();
    }
  },

  clearAdminForm: () =>
    set({ adminFormData: { ...formData }, selectedLab: null, error: null, loading: false, popup: null }),
});

export default addAdminSlice;
