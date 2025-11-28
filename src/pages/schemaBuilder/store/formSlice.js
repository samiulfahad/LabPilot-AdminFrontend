export const formSlice = (set, get) => ({
  // Form state
  currentField: {
    label: "",
    type: "text",
    required: "no",
    unit: "",
    standardRange: null,
    options: [],
    sectionId: "",
    editingIndex: null,
    editingSectionIndex: null,
  },
  currentSection: {
    name: "",
    description: "",
  },
  testStandardRange: {
    type: "options",
    options: [],
    text: "",
  },
  newOption: "",
  newTestStandardRangeKey: "",
  newTestStandardRangeValue: "",

  // Form actions
  setCurrentField: (currentField) => set({ currentField }),
  updateCurrentField: (updates) =>
    set((state) => ({
      currentField: { ...state.currentField, ...updates },
    })),
  setCurrentSection: (currentSection) => set({ currentSection }),
  updateCurrentSection: (updates) =>
    set((state) => ({
      currentSection: { ...state.currentSection, ...updates },
    })),
  setTestStandardRange: (testStandardRange) => set({ testStandardRange }),
  updateTestStandardRange: (updates) =>
    set((state) => ({
      testStandardRange: { ...state.testStandardRange, ...updates },
    })),
  setNewOption: (newOption) => set({ newOption }),
  setNewTestStandardRangeKey: (newTestStandardRangeKey) => set({ newTestStandardRangeKey }),
  setNewTestStandardRangeValue: (newTestStandardRangeValue) => set({ newTestStandardRangeValue }),

  // Field options management
  addFieldOption: () => {
    const state = get();
    if (!state.newOption.trim()) {
      state.setPopup({ type: "error", message: "Option cannot be empty" });
      return;
    }

    set((state) => ({
      currentField: {
        ...state.currentField,
        options: [...state.currentField.options, state.newOption.trim()],
      },
      newOption: "",
    }));
  },

  removeFieldOption: (index) => {
    set((state) => ({
      currentField: {
        ...state.currentField,
        options: state.currentField.options.filter((_, i) => i !== index),
      },
    }));
  },

  // Test standard range management
  addTestStandardRangeOption: () => {
    const state = get();
    if (!state.newTestStandardRangeKey.trim() || !state.newTestStandardRangeValue.trim()) {
      state.setPopup({ type: "error", message: "Both key and value are required" });
      return;
    }

    set((state) => ({
      testStandardRange: {
        ...state.testStandardRange,
        options: [
          ...state.testStandardRange.options,
          {
            key: state.newTestStandardRangeKey.trim(),
            value: state.newTestStandardRangeValue.trim(),
          },
        ],
      },
      newTestStandardRangeKey: "",
      newTestStandardRangeValue: "",
    }));
  },

  removeTestStandardRangeOption: (index) => {
    set((state) => ({
      testStandardRange: {
        ...state.testStandardRange,
        options: state.testStandardRange.options.filter((_, i) => i !== index),
      },
    }));
  },

  // Reset form
  resetFieldForm: () =>
    set({
      currentField: {
        label: "",
        type: "text",
        required: "no",
        unit: "",
        standardRange: null,
        options: [],
        sectionId: "",
        editingIndex: null,
        editingSectionIndex: null,
      },
      newOption: "",
    }),

  resetSectionForm: () =>
    set({
      currentSection: {
        name: "",
        description: "",
      },
    }),

  resetAllForms: () =>
    set({
      currentField: {
        label: "",
        type: "text",
        required: "no",
        unit: "",
        standardRange: null,
        options: [],
        sectionId: "",
        editingIndex: null,
        editingSectionIndex: null,
      },
      currentSection: {
        name: "",
        description: "",
      },
      testStandardRange: {
        type: "options",
        options: [],
        text: "",
      },
      newOption: "",
      newTestStandardRangeKey: "",
      newTestStandardRangeValue: "",
    }),
});
