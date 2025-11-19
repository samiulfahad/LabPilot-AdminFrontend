import labService from "../../../services/labSevice";
const labSlice = (set, get) => ({
  // State
  labs: [],

  // Actions
  loadLabs: async () => {
    try {
      get().startLoading();
      const response = await labService.getLabs({ isLabManagement: true });
      set({ labs: response.data.labs });
      
    } catch (error) {
      set({ popup: "error", popupMessage: "Could not load labs", popupData: null });
    } finally {
      get().stopLoading();
    }
  },
});


export default labSlice