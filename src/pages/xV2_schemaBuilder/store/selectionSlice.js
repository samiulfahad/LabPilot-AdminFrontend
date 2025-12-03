export const selectionSlice = (set, get) => ({
  // Selection state
  testCategories: [],
  selectedCategory: "",
  selectedTest: "",
  availableTests: [],

  // Selection actions
  setTestCategories: (testCategories) => set({ testCategories }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedTest: (selectedTest) => set({ selectedTest }),
  setAvailableTests: (availableTests) => set({ availableTests }),

  // Helper functions
  updateAvailableTests: () => {
    const state = get();
    if (state.selectedCategory) {
      const category = state.testCategories.find((cat) => cat._id === state.selectedCategory);
      const availableTests = category?.tests || [];

      set({ availableTests });

      // If in edit mode and current selected test doesn't belong to selected category, clear it
      if (state.isEditMode && state.selectedTest) {
        const testExists = category?.tests?.some((test) => test._id === state.selectedTest);
        if (!testExists) {
          set({ selectedTest: "" });
        }
      }
    } else {
      set({ availableTests: [] });
      if (!state.isEditMode) {
        set({ selectedTest: "" });
      }
    }
  },

  // Reset selection
  resetSelection: () =>
    set({
      selectedCategory: "",
      selectedTest: "",
      availableTests: [],
    }),
});
