import labTestService from "../../../services/testService";

const categorySlice = (set, get) => ({
  // State
  categoryList: [],

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

  clearCategories: () => set({ categories: [] }),
});

export default categorySlice;
