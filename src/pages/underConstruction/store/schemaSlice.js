import { data } from "react-router-dom";
import labTestService from "../../../services/testService";

const schemaSlice = (set, get) => ({
  testList: [],
  schema: {
    name: "",
    description: "",
    testId: "",
    categoryId: "",
    isActive: false, // New field added
    hasMultiSection: false,
    hasStandardRange: false,
    standardRange: "",
    sections: [],
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

  // Generate ID from section name
  generateSectionId: (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-z0-9_]/g, ""); // Remove special characters
  },

  // Check if section name already exists
  isSectionNameUnique: (name, excludeId = null) => {
    const { sections } = get().schema;
    const normalizedNewName = name.toLowerCase().trim();

    return !sections.some((section) => {
      if (excludeId && section.id === excludeId) return false; // Skip the section being edited
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

    // Generate ID from section name
    const sectionId = get().generateSectionId(sectionName);

    set((state) => ({
      schema: {
        ...state.schema,
        sections: [
          ...state.schema.sections,
          {
            id: sectionId,
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

  // Delete a specific section by id
  deleteSection: (sectionId) => {
    const section = get().schema.sections.find((s) => s.id === sectionId);

    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.filter((section) => section.id !== sectionId),
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
  updateSection: (sectionId, newName) => {
    const newNameTrimmed = newName.trim();
    if (!newNameTrimmed) return;

    // Check if the new name is unique (excluding the current section)
    if (!get().isSectionNameUnique(newNameTrimmed, sectionId)) {
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

    // Generate new ID from the new name
    const newSectionId = get().generateSectionId(newNameTrimmed);
    const oldSection = get().schema.sections.find((s) => s.id === sectionId);

    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections.map((section) =>
          section.id === sectionId ? { ...section, id: newSectionId, name: newNameTrimmed } : section
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

  // Show confirmation when disabling multi-section
  confirmDisableMultiSection: () => {
    set({
      popup: {
        type: "confirmation",
        message: "All data of this section will be lost? Are you sure?",
        data: null,
        onConfirm: () => {
          // This function will be called when user confirms
          set((state) => ({
            schema: {
              ...state.schema,
              hasMultiSection: false,
              sections: [],
              currentSectionName: "",
            },
          }));
          // Close the popup
          set({ popup: null });
        },
      },
    });
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

  // Clear section values
  clearSections: () => {
    set((state) => ({
      schema: {
        ...state.schema,
        sections: [],
        currentSectionName: "",
      },
    }));
  },
});

export default schemaSlice;
