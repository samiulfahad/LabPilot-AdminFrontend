import labService from "../../../services/labSevice";
const labSlice = (set, get) => ({
  // State
  labs: [],

  // Actions
  loadLabs: async () => {
    try {
      get().startLoading();
      const response = await labService.getLabs({ isLabManagement: true });
      set({ labs: response.data });
    } catch (error) {
      get().setPopup({ type: "error", message: "Could not load labs", action: null, data: null });
    } finally {
      get().stopLoading();
    }
  },

  deactivateLab: async () => {
    try {
      get().startLoading();
      const _id = get().popup.data.labId;
      // console.log(_id);
      await labService.deactivateLab(_id);

      set((state) => ({
        labs: state.labs.map((lab) => (lab._id === _id ? { ...lab, isActive: false } : lab)),
      }));

      get().setPopup({ type: "success", message: "Lab deactivated successfully", action: null, data: null });
    } catch (e) {
      console.log(e);
      get().setPopup({ type: "error", message: "Could not deactivated lab", action: null, data: null });
    } finally {
      get().stopLoading();
    }
  },

  activateLab: async () => {
    try {
      get().startLoading();
      const _id = get().popup.data.labId;
      await labService.activateLab(_id);
      set((state) => ({
        labs: state.labs.map((lab) => (lab._id === _id ? { ...lab, isActive: true } : lab)),
      }));
      get().setPopup({ type: "success", message: "Lab activated successfully", action: null, data: null });
    } catch (e) {
      console.log(e);
      get().setPopup({ type: "error", message: "Could not activated lab", action: null, data: null });
    } finally {
      get().stopLoading();
    }
  },
});

export default labSlice;
