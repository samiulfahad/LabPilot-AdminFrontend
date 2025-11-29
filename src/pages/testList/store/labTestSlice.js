import labTestService from "../../../services/testService";
import schemaServive from "../../../services/schemaService";
const categorySlice = (set, get) => ({
  // State
  categoryList: [],
  testAssociatedSchemaList: [],

  loadCategoryList: async () => {
    try {
      get().startLoading();
      const response = await labTestService.getAllTests();
      set({ categoryList: response.data });
    } catch (e) {
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  addCategory: async (name) => {
    try {
      get().startLoading();
      const response = await labTestService.addCategory({ categoryName: name });

      set((state) => ({
        popup: { type: "success", message: "New Category added successfully" },
        categoryList: [...state.categoryList, response.data],
      }));

      get().closeModal();
    } catch (e) {
      let message = "Failed to add category";
      console.log(e);
      if (e.response?.data?.duplicate) {
        message = "This category already exists";
      }
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  editCategory: async (categoryId, categoryName) => {
    try {
      get().startLoading();
      await labTestService.editCategory({ categoryId, categoryName });
      set((state) => ({
        popup: {
          type: "success",
          message: "Category updated successfully",
          data: null,
          action: null,
        },
        categoryList: state.categoryList.map((category) =>
          category._id === categoryId ? { ...category, categoryName: categoryName } : category
        ),
      }));
      get().closeModal();
    } catch (e) {
      let message = "Failed to update category";

      if (e.response?.data?.duplicate) {
        message = "Category already exists";
      }
      set({ popup: { type: "error", message: message, data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteCategory: async () => {
    try {
      get().startLoading();
      const categoryId = get().popup.data;
      await labTestService.deleteCategory(categoryId);
      set((state) => ({
        popup: { type: "success", message: "Category deleted successfully" }, // Fixed message
        categoryList: state.categoryList.filter((category) => category._id !== categoryId),
      }));

      get().closeModal();
    } catch (e) {
      console.log(e);
      set({ popup: { type: "error", message: "Failed to add category", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  addTest: async (categoryId, name) => {
    try {
      get().startLoading();
      console.log(categoryId, name);
      const response = await labTestService.addLabTest({ categoryId: categoryId, name: name });

      // console.log(response.data);

      set((state) => ({
        popup: { type: "success", message: "New Test added successfully" },
        categoryList: state.categoryList.map((category) =>
          category._id === categoryId ? { ...category, tests: [...(category.tests || []), response.data] } : category
        ),
      }));

      get().closeModal();
    } catch (e) {
      let message = "Failed to add test";
      console.log(e);
      if (e.response?.data?.duplicate) {
        message = "This test already exists";
      }
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  editTest: async (categoryId, testId, testName) => {
    try {
      get().startLoading();
      await labTestService.editTest({ categoryId, testId, name: testName });
      set((state) => ({
        popup: {
          type: "success",
          message: "Test updated successfully",
          data: null,
          action: null,
        },
        categoryList: state.categoryList.map((category) =>
          category._id === categoryId
            ? {
                ...category,
                tests: category.tests.map((test) =>
                  test._id === testId
                    ? { ...test, name: testName } // Update the test name
                    : test
                ),
              }
            : category
        ),
      }));
      get().closeModal();
    } catch (e) {
      let message = "Failed to update Test";

      if (e.response?.data?.duplicate) {
        message = "Test already exists";
      }
      set({ popup: { type: "error", message: message, data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteTest: async () => {
    try {
      get().startLoading();
      const { categoryId, testId } = get().popup.data;
      // console.log(categoryId, testId);
      await labTestService.deleteTest(categoryId, testId);

      set((state) => ({
        popup: { type: "success", message: "Test deleted successfully" },
        categoryList: state.categoryList.map((category) =>
          category._id === categoryId
            ? {
                ...category,
                tests: (category.tests || []).filter((test) => test._id !== testId),
              }
            : category
        ),
      }));

      get().closeModal();
    } catch (e) {
      console.log(e);
      set({
        popup: {
          type: "error",
          message: "Failed to delete test",
          action: null,
          data: null,
        },
      });
    } finally {
      get().stopLoading();
    }
  },

  loadTestSchema: async (testId) => {
    try {
      get().startLoading();
      const response = await schemaServive.getByTestId(testId);
      set((state) => ({
        testAssociatedSchemaList: response.data,
      }));
      console.log(response.data);
      if (response.data.length === 0) {
        set({ popup: { type: "error", message: "No Schema has been added for this test", data: null, action: null } });
        get().closeModal();
      }
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load test associated schemas", data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  setDefaultSchema: async (categoryId, testId, schemaId) => {
    try {
      get().startLoading();
      await labTestService.setDefaultSchema(categoryId, testId, schemaId);
      get().closeModal();
      set({ popup: { type: "success", message: "Default schema set successfully", data: null, action: null } });
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to set default schema set", data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  clearCategories: () => set({ categories: [] }),
});

export default categorySlice;
