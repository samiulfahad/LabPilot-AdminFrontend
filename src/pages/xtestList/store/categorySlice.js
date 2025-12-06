import testCategoryService from "../../../services/testCategoryService";
const categorySlice = (set, get) => ({
  // State
  categoryList: [],
  populatedList: [],
  loadCategoryList: async () => {
    try {
      get().startLoading();
      const response = await testCategoryService.getCategoryList();
      set({ categoryList: response.data });
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load category list", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },
  populateCategory: async () => {
    try {
      get().startLoading();
      const response = await testCategoryService.getPopulatedList();
      const flatTests = response.data.flatMap((cat) => cat.testList);
      set({ populatedList: response.data, testList: flatTests });
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load populated categories", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },
  addCategory: async (name) => {
    try {
      get().startLoading();
      const response = await testCategoryService.addCategory({ name: name });
      const newCategory = response.data;
      set((state) => ({
        popup: { type: "success", message: "New Category added successfully" },
        categoryList: [...state.categoryList, newCategory],
        populatedList: [...state.populatedList, { ...newCategory, testList: [] }],
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
  editCategory: async (categoryId, name) => {
    try {
      get().startLoading();
      await testCategoryService.editCategory({ categoryId, name });
      set((state) => ({
        popup: {
          type: "success",
          message: "Category updated successfully",
          data: null,
          action: null,
        },
        categoryList: state.categoryList.map((category) =>
          category._id === categoryId ? { ...category, name: name } : category
        ),
        populatedList: state.populatedList.map((category) =>
          category._id === categoryId ? { ...category, categoryName: name } : category
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
      await testCategoryService.deleteCategory(categoryId);
      set((state) => {
        const deletedCat = state.populatedList.find((cat) => cat._id === categoryId);
        const deletedTestIds = new Set(deletedCat ? deletedCat.testList.map((t) => t._id) : []);
        return {
          popup: { type: "success", message: "Category deleted successfully" },
          categoryList: state.categoryList.filter((category) => category._id !== categoryId),
          populatedList: state.populatedList.filter((category) => category._id !== categoryId),
          testList: state.testList.filter((t) => !deletedTestIds.has(t._id)),
        };
      });
      get().closeModal();
    } catch (e) {
      console.log(e);
      set({ popup: { type: "error", message: "Failed to delete category", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },
  clearCategories: () => set({ categories: [] }),
});
export default categorySlice;
