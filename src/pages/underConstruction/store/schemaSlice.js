import labTestService from "../../../services/testService";
const schemaSlice = (set, get) => ({
  testList: [],
  schema: {
    name: "",
    testName: "",
    testId: "",
    categoryId: "",
    isActive: false, // New field added
    hasStandardRange: false,
    standardRange: "",
    sections: [
      {
        name: "Default",
        fields: [],
      },
    ],
    currentSectionName: "",
  },
  // Complete setSchema function
  setSchema: (field, value) => {
    set((state) => ({
      schema: {
        ...state.schema,
        [field]: value,
      },
    }));
  },
  loadTestList: async () => {
    try {
      get().startLoading();
      const response = await labTestService.getAllTests();
      set({ testList: response.data });
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load schema", data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },
  // Check if section name already exists
  isSectionNameUnique: (name, excludeName = null) => {
    const { sections } = get().schema;
    const normalizedNewName = name.toLowerCase().trim();
    return !sections.some((section) => {
      if (excludeName && section.name === excludeName) return false; // Skip the section being edited
      const normalizedExistingName = section.name.toLowerCase().trim();
      return normalizedExistingName === normalizedNewName;
    });
  },
  addSection: () => {
    const { schema } = get();
    const sectionName = schema.currentSectionName.trim();
    if (!sectionName) return;
    // Check if section name already exists
    if (!get().isSectionNameUnique(sectionName)) {
      set({
        popup: {
          type: "error",
          message: `Section name "${sectionName}" already exists! Please use a unique name.`,
          data: null,
          action: null,
        },
      });
      return;
    }
    set((state) => ({
      schema: {
        ...state.schema,
        sections: [
          ...state.schema.sections,
          {
            name: sectionName,
            fields: [],
          },
        ],
        currentSectionName: "",
      },
    }));
    // Show success message
    set({
      popup: { type: "success", message: `Section "${sectionName}" added successfully!`, data: null, action: null },
    });
  },
  // Delete a specific section by name
  deleteSection: (sectionName) => {
    const { sections } = get().schema;
    if (sections.length === 1) {
      set({
        popup: {
          type: "error",
          message: "Cannot delete the last section!",
          data: null,
          action: null,
        },
      });
      return;
    }
    const section = sections.find((s) => s.name === sectionName);
    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.filter((section) => section.name !== sectionName),
      },
    }));
    // Show success message
    if (section) {
      set({
        popup: {
          type: "success",
          message: `Section "${section.name}" deleted successfully!`,
          data: null,
          action: null,
        },
      });
    }
  },
  // Update a section name
  updateSection: (oldName, newName) => {
    const newNameTrimmed = newName.trim();
    if (!newNameTrimmed) return;
    // Check if the new name is unique (excluding the current section)
    if (!get().isSectionNameUnique(newNameTrimmed, oldName)) {
      set({
        popup: {
          type: "error",
          message: `Section name "${newNameTrimmed}" already exists! Please use a unique name.`,
          data: null,
          action: null,
        },
      });
      return;
    }
    const oldSection = get().schema.sections.find((s) => s.name === oldName);
    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.map((section) =>
          section.name === oldName ? { ...section, name: newNameTrimmed } : section
        ),
      },
    }));
    // Show success message
    if (oldSection) {
      set({
        popup: {
          type: "success",
          message: `Section renamed from "${oldSection.name}" to "${newNameTrimmed}" successfully!`,
          data: null,
          action: null,
        },
      });
    }
  },
  // Show confirmation when removing standard range with data
  confirmRemoveStandardRange: () => {
    set({
      popup: {
        type: "confirmation",
        message: "All standard range data will be lost? Are you sure?",
        data: null,
        onConfirm: () => {
          // This function will be called when user confirms
          set((state) => ({
            schema: {
              ...state.schema,
              hasStandardRange: false,
              standardRange: "",
            },
          }));
          // Close the popup
          set({ popup: null });
        },
      },
    });
  },
  // Clear standard range values
  clearStandardRange: () => {
    set((state) => ({
      schema: {
        ...state.schema,
        standardRange: "",
      },
    }));
  },
});
export default schemaSlice;
