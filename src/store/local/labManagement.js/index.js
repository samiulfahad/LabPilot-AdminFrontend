import { create } from "zustand";
import labService from "../../../services/labSevice";
import { addAdminFormSlice } from "./addAdminSlice";

const useLabManagement = create((set, get) => ({
  ...addAdminFormSlice(set, get),
  loading: false,
  error: null,
  setError: (errorMessage) => set({ error: errorMessage }),
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
  clearState: () => set({ loading: false, error: null, labs: [] }),
}));

export default useLabManagement;
