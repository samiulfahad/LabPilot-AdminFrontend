export const uiSlice = (set, get) => ({
  // UI state
  isLoading: false,
  isSaving: false,
  popup: null,
  testsLoading: true,
  editingSectionIndex: null,
  editingFieldId: null,
  isAddingRange: false,

  // UI actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setPopup: (popup) => set({ popup }),
  setTestsLoading: (testsLoading) => set({ testsLoading }),
  setEditingSectionIndex: (editingSectionIndex) => set({ editingSectionIndex }),
  setEditingFieldId: (editingFieldId) => set({ editingFieldId }),
  setIsAddingRange: (isAddingRange) => set({ isAddingRange }),

  // Helper functions
  isEditing: () => {
    const state = get();
    return state.editingSectionIndex !== null || state.editingFieldId !== null;
  },

  // Reset UI
  resetUI: () => set({
    isLoading: false,
    isSaving: false,
    popup: null,
    testsLoading: false,
    editingSectionIndex: null,
    editingFieldId: null,
    isAddingRange: false,
  }),
});