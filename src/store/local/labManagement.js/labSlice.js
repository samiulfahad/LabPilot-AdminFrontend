import labService from "../../../services/labSevice";

export const createLabSlice = (set, get) => ({
  // State
  labs: [],

  // Actions
  loadLabs: async () => {
    try {
      get().startLoading();
      const response = await labService.getLabs({ isLabManagement: true });
      set({ labs: response.data.labs });
    } catch (error) {
      get().setError("error.message");
      console.log("Failed to load labs:", error);
    } finally {
      get().stopLoading();
    }
  },
});
