import testCategoryService from "../../../services/testCategoryService";

const categorySlice = (set, get) => ({
  categoryList: [],

  populatedList: [],

  loadCategoryList: async () => {
    try {
      get().startLoading();
      const response = await testCategoryService.getCategoryList();
      console.log(response.data);
      set({ categoryList: response.data });
    } catch (e) {
    } finally {
      get().stopLoading();
    }
  },

  populateCategory: async () => {
    try {
      get().startLoading();
      const response = await testCategoryService.getPopulatedList();
      console.log(response.data);
      set((state) => ({ populatedList: [...response.data] }));
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load populated test list" } });
    } finally {
      get().stopLoading();
    }
  },

  addCategory: async (name) => {
    try {
      get().startLoading();
      const response = await testCategoryService.addCategory({ name });
      console.log(response.data);

      set((state) => ({
        categoryList: [...state.categoryList, response.data],
        popup: { type: "success", message: "Category added successfully" },
      }));
      get().closeModal();
    } catch (e) {
      let message = "Failed to add test";
      if (e.response?.data?.duplicate) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },
  editCategory: async (categoryId, name) => {
    try {
      get().startLoading();
      const response = await testCategoryService.editCategory({ categoryId, name });
      console.log(response.data);
      get().closeModal();
      set((state) => ({
        categoryList: state.categoryList.map((item) => (item._id === categoryId ? { _id: categoryId, name } : item)),
        popup: { type: "success", message: "Category updated successfully", data: null, action: null },
      }));
    } catch (e) {
      let message = "Failed to update category";
      if (e.response?.data?.duplicate) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message, data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteCategory: async () => {
    try {
      get().startLoading();
      const { categoryId } = get().popup.data;
      await testCategoryService.deleteCategory(categoryId);
      set((state) => ({
        popup: { type: "success", message: "Category deleted successfully", data: null, action: null },
        categoryList: state.categoryList.filter((item) => item._id !== categoryId),
      }));
      get().closeModal();
    } catch (e) {
      console.log(e);
      set({
        popup: { type: "error", message: "Failed to delete category", action: null, data: null },
      });
    } finally {
      get().stopLoading();
    }
  },
});

export default categorySlice;
