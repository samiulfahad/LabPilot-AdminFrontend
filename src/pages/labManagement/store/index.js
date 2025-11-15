import { create } from "zustand";
import labService from "../../../services/labSevice";
import adminSlice from "./adminSlice";
import staffSlice from "./staffSlice";
import modalSlice from "../../../store/common/modalSlice";
import loadingSlice from "../../../store/common/loadingSlice";
import popupSlice from "../../../store/common/popupSlice";

const useLabManagementStore = create((set, get) => ({
  ...adminSlice(set, get),
  ...staffSlice(set, get),
  ...loadingSlice(set, get),
  ...modalSlice(set, get),
  ...popupSlice(set, get),

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

  clearState: () =>
    set({
      loading: false,
      popup: null,
      popupMessage: null,
      activeModal: null,
      modalData: null,
      selectedLab: null,
      adminForm: {},
    }),
}));

export default useLabManagementStore;
