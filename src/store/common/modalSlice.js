const modalSlice = (set) => ({
  // State
  activeModal: null,
  modalData: null, // Add separate data property for better organization

  // Actions
  setActiveModal: (modalType, data) => set({ activeModal: modalType, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
});

export default modalSlice;
