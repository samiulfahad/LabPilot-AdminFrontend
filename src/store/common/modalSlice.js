const modalSlice = (set, get) => ({
  modal: {
    view: null,
    data: null,
  },

  setModal: (payload) => set({ modal: payload }),

  closeModal: () =>
    set({
      modal: {
        view: null,
        data: null,
      },
    }),
});

export default modalSlice;
