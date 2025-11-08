const appSlice = (set, get) => ({
  loading: false,
  error: null,
  setError: (errorMessage) => set({ error: errorMessage }),
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
});

export default appSlice;
