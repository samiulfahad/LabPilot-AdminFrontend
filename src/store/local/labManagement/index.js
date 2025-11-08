import { create } from "zustand";
import labService from "../../../services/labSevice";
import addAdminSlice from "./addAdminSlice";
import appSlice from "../../global/appSlice";

const useLabManagement = create((set, get) => ({
  ...addAdminSlice(set, get),
  ...appSlice(set, get),
  labs: [],
  loadLabs: async () => {
    try {
      get().startLoading();
      const response = await labService.getLabs({ isLabManagement: true });
      set({ labs: response.data.labs });
    } catch (e) {
      get().setError("Failed to load labs");
      console.log("Failed to load labs:", e);
    } finally {
      get().stopLoading();
    }
  },
  clearState: () => set({ loading: false, error: null, labs: [], popup: null }),
}));

export default useLabManagement;
