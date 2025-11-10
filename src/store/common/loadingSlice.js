const appSlice = (set, get) => ({
  loading: false,
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
});

export default appSlice;
