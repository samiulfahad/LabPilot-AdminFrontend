const popupSlice = (set, get) => ({
  popup: {
    type: null,
    action: null,
    message: null,
    data: null,
  },

  setPopup: (payload) => set({ popup: payload }),

  closePopup: () =>
    set({
      popup: {
        type: null,
        action: null,
        message: null,
        data: null,
      },
    }),
});

export default popupSlice;
