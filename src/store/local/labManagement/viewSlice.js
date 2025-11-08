export const createViewSlice = (set) => ({
  // State
  view: "", // "staff", "admin", "labDetails"
  viewData: null,
  activeModal: "", // "view", "addAdmin", "addSupportAdmin"

  // Actions
  setActiveModal: (modalType) => set({ activeModal: modalType }),
  setView: (viewType, data = null) => set({ view: viewType, viewData: data }),
  closeView: () => set({ view: "", viewData: null, activeModal: "" }),
  clearViewData: () => set({ viewData: null }),
});
