const formData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  isActive: "",
};

export const createAddAdminFormSlice = (set, get) => ({
  adminFormData: { ...formData },
  selectedLab: null,

  // Actions
  updateAdminFormField: (field, value) => set({ formData: { ...get().adminFormData, [field]: value } }),

  handleAddAdmin: async () => {
    try {
      get().startLoading();
    } catch (e) {
      get().setError("Could not add admin")
    } finally {
      get().stopLoading();
    }
  },
});
