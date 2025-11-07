import { create } from "zustand";
import labService from "../../services/labSevice";

const useLabManagement = create((set, get) => ({
  loading: false,
  labs: [],
  view: "", // "staff", "admin", "labDetails"
  viewData: null, // Data for the current view
  activeModal: "",
  setActiveModal: (value) => set({ activeModal: value }),
  selectedLab: null,
  setSelectedLab: (value) => set({ selectedLab: value }),
  // View management actions
  setView: (viewType, data = null) => set({ view: viewType, viewData: data }),
  closeView: () => set({ view: "", viewData: null, activeModal: "" }),
  clearViewData: () => set({ viewData: null }),

  // Existing actions
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
  loadLabs: async () => {
    try {
      set({ loading: true });
      const response = await labService.getLabs({ isLabManagement: true });
      set({ labs: response.data.labs });
    } catch (e) {
      console.log("Failed to load labs:", e);
    } finally {
      set({ loading: false });
    }
  },
  clearState: () => set({ loading: false, labs: [], view: "", viewData: null }),
}));

export default useLabManagement;
