export const schemaSlice = (set, get) => ({
  // Schema state
  schema: {
    name: "",
    description: "",
    fields: [],
  },
  useSections: false,
  useStandardRange: false,
  isEditMode: false,
  initialSchemaData: null,
  isActive: true,

  // Schema actions
  setSchema: (schema) => set({ schema }),
  updateSchema: (updates) => set((state) => ({ 
    schema: { ...state.schema, ...updates } 
  })),
  setUseSections: (useSections) => set({ useSections }),
  setUseStandardRange: (useStandardRange) => set({ useStandardRange }),
  setIsEditMode: (isEditMode) => set({ isEditMode }),
  setInitialSchemaData: (initialSchemaData) => set({ initialSchemaData }),
  setIsActive: (isActive) => set({ isActive }),

  // Helper functions
  getFieldsCount: () => {
    const state = get();
    if (state.useSections && state.schema.sections) {
      return state.schema.sections.reduce((total, section) => total + section.fields.length, 0);
    }
    return state.schema.fields.length;
  },

  // Field management
  addFieldToSchema: (fieldData, sectionIndex = null) => {
    set((state) => {
      if (state.useSections && sectionIndex !== null) {
        const newSections = state.schema.sections?.map((section, index) =>
          index === sectionIndex 
            ? { ...section, fields: [...section.fields, fieldData] }
            : section
        ) || [];
        
        return {
          schema: {
            ...state.schema,
            sections: newSections,
          },
        };
      } else {
        return {
          schema: {
            ...state.schema,
            fields: [...state.schema.fields, fieldData],
          },
        };
      }
    });
  },

  updateFieldInSchema: (fieldData, fieldIndex, sectionIndex = null) => {
    set((state) => {
      if (state.useSections && sectionIndex !== null) {
        return {
          schema: {
            ...state.schema,
            sections: state.schema.sections?.map((section, sIndex) =>
              sIndex === sectionIndex
                ? {
                    ...section,
                    fields: section.fields.map((field, fIndex) =>
                      fIndex === fieldIndex ? fieldData : field
                    ),
                  }
                : section
            ) || [],
          },
        };
      } else {
        return {
          schema: {
            ...state.schema,
            fields: state.schema.fields.map((field, fIndex) =>
              fIndex === fieldIndex ? fieldData : field
            ),
          },
        };
      }
    });
  },

  removeFieldFromSchema: (fieldIndex, sectionIndex = null) => {
    set((state) => {
      if (state.useSections && sectionIndex !== null) {
        return {
          schema: {
            ...state.schema,
            sections: state.schema.sections?.map((section, sIndex) =>
              sIndex === sectionIndex
                ? { 
                    ...section, 
                    fields: section.fields.filter((_, fIndex) => fIndex !== fieldIndex) 
                  }
                : section
            ) || [],
          },
        };
      } else {
        return {
          schema: {
            ...state.schema,
            fields: state.schema.fields.filter((_, fIndex) => fIndex !== fieldIndex),
          },
        };
      }
    });
  },

  // Section management
  addSection: (section) => {
    set((state) => ({
      schema: {
        ...state.schema,
        sections: [...(state.schema.sections || []), section],
      },
    }));
  },

  updateSection: (sectionIndex, updatedSection) => {
    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections?.map((section, index) =>
          index === sectionIndex ? updatedSection : section
        ) || [],
      },
    }));
  },

  removeSection: (sectionIndex) => {
    set((state) => ({
      schema: {
        ...state.schema,
        sections: state.schema.sections?.filter((_, index) => index !== sectionIndex) || [],
      },
    }));
  },

  // Reset schema
  resetSchema: () => set({
    schema: {
      name: "",
      description: "",
      fields: [],
    },
    useSections: false,
    useStandardRange: false,
    isEditMode: false,
    initialSchemaData: null,
    isActive: true,
  }),
});