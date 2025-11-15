const popupSlice = (set, get) => ({
  popup: null,
  popupMessage: null,
  popupData: null,

  setPopupMessage: (message) => set({ popupMessage: message }),
  setPopup: (type) => set({ popup: type }),
  setPopupData: (data) => set({popupData: data}),
  closePopup: () => set({ popup: null, popupMessage: null, popupData: null }),
});

export default popupSlice;
