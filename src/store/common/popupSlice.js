const popupSlice = (set, get) => ({
  popupType: null,
  popupMessage: null,
  popupMessage: (message) => set({ popupMessage: message }),
  setPopupType: (type) => set({ popupType: type }),
  closePopup: () => set({ popupType: null, popupMessage: null }),
});

export default popupSlice;
