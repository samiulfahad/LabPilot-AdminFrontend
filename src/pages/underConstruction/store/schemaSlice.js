// schemaSlice.js
import labTestService from "../../../services/testService";

const schemaSlice = (set, get) => ({
  testList: [],
  schema: {
    name: "",
    testName: "",
    testId: "",
    categoryId: "",
    isActive: false,
    hasStandardRange: false,
    standardRange: "",
    sections: [{ name: "Default", fields: [] }],
    currentSectionName: "",
  },

  setSchema: (field, value) => {
    set((state) => ({
      schema: { ...state.schema, [field]: value },
    }));
  },

  loadTestList: async () => {
    try {
      get().startLoading();
      const response = await labTestService.getAllTests();
      set({ testList: response.data });
    } catch (e) {
      get().setPopup({
        type: "error",
        message: "Failed to load tests. Please try again.",
      });
    } finally {
      get().stopLoading();
    }
  },

  isSectionNameUnique: (name, excludeName = null) => {
    const sections = get().schema.sections;
    const normalized = name.toLowerCase().trim();
    return !sections.some((s) => {
      if (excludeName && s.name === excludeName) return false;
      return s.name.toLowerCase().trim() === normalized;
    });
  },

  addSection: () => {
    const name = get().schema.currentSectionName.trim();
    if (!name) return;

    if (!get().isSectionNameUnique(name)) {
      get().setPopup({
        type: "error",
        message: `Section "${name}" already exists!`,
      });
      return;
    }

    set((state) => ({
      schema: {
        ...state.schema,
        sections: [...state.schema.sections, { name, fields: [] }],
        currentSectionName: "",
      },
    }));

    get().setPopup({
      type: "success",
      message: `Section "${name}" added successfully!`,
    });
  },

  deleteSection: (sectionName) => {
    if (get().schema.sections.length === 1) {
      get().setPopup({
        type: "error",
        message: "Cannot delete the last section!",
      });
      return;
    }

    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.filter((s) => s.name !== sectionName),
      },
    }));

    get().setPopup({
      type: "success",
      message: `Section "${sectionName}" deleted!`,
    });
  },

  updateSection: (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (!get().isSectionNameUnique(trimmed, oldName)) {
      get().setPopup({
        type: "error",
        message: `Section "${trimmed}" already exists!`,
      });
      return;
    }

    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.map((s) => (s.name === oldName ? { ...s, name: trimmed } : s)),
      },
    }));

    get().setPopup({
      type: "success",
      message: `Section renamed successfully!`,
    });
  },

  confirmRemoveStandardRange: () => {
    get().setPopup({
      type: "confirmation",
      message: "This will delete all reference values. Continue?",
      onConfirm: () => {
        set((state) => ({
          schema: {
            ...state.schema,
            hasStandardRange: false,
            standardRange: "",
          },
        }));
        get().setPopup({
          type: "success",
          message: "Standard range disabled.",
        });
      },
    });
  },

  clearStandardRange: () => {
    set((state) => ({
      schema: { ...state.schema, standardRange: "" },
    }));
  },
});

export default schemaSlice;
