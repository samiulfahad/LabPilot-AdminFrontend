import testService from "../../../services/testService";
import schemaServive from "../../../services/schemaService";
const testSlice = (set, get) => ({
  // State
  testList: [],
  testAssociatedSchemaList: [],
  clearTestList: () => set({ testList: [] }),

  loadTestList: async () => {
    try {
      get().startLoading();
      const response = await testService.getTestList();
      set({ testList: response.data });
      console.log(response.data);
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to load test list", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  addTest: async (categoryId, name) => {
    try {
      get().startLoading();
      const response = await testService.addTest({ categoryId, name });
      const newTest = response.data.test; // Assuming .test based on console.log; change to response.data if needed
      set((state) => ({
        testList: [...state.testList, newTest],
        popup: { type: "success", message: "New Test added successfully" },
      }));
      get().populate();
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

  editTest: async (testId, categoryId, name) => {
    try {
      get().startLoading();
      const updated = { testId, categoryId, name };
      const response = await testService.editTest(updated);
      get().closeModal();
      set((state) => ({
        testList: state.testList.map((test) => (test._id === testId ? { ...test, categoryId, name } : test)),
        popup: { type: "success", message: "Test updated successfully", data: null, action: null },
      }));
      get().populate();
    } catch (e) {
      let message = "Failed to update Test";
      if (e.response?.data?.duplicate) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message, data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteTest: async () => {
    try {
      get().startLoading();
      const { testId } = get().popup.data;
      await testService.deleteTest(testId);
      set((state) => ({
        popup: { type: "success", message: "Test deleted successfully", data: null, action: null },
        testList: state.testList.filter((test) => test._id !== testId),
      }));
      get().populate();
      get().closeModal();
    } catch (e) {
      console.log(e);
      set({
        popup: { type: "error", message: "Failed to delete test", action: null, data: null },
      });
    } finally {
      get().stopLoading();
    }
  },

  loadTestSchema: async (testId) => {
    try {
      get().startLoading();
      const response = await schemaServive.getByTestId(testId, true);
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
      get().closeModal();
    } finally {
      get().stopLoading();
    }
  },

  setSchema: async (testId, schemaId) => {
    try {
      get().startLoading();
      console.log(testId, schemaId);
      await testService.setSchema(testId, schemaId);
      get().closeModal();
      set((state) => ({
        testList: state.testList.map((test) => (test._id === testId ? { ...test, schemaId: schemaId } : test)),
        popup: {
          type: "success",
          message: "Schema set successfully",
          data: null,
          action: null,
        },
      }));
      get().populate();
    } catch (e) {
      set({ popup: { type: "error", message: "Failed to set schema", data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },
  
  unsetSchema: async () => {
    try {
      get().startLoading();
      const { testId } = get().popup.data;
      await testService.unsetSchema(testId);
      get().closeModal();
      set((state) => ({
        testList: state.testList.map((test) => (test._id === testId ? { ...test, schemaId: null } : test)),
        popup: {
          type: "success",
          message: "Removed schema successfully",
          data: null,
          action: null,
        },
      }));
      get().populate();
    } catch (e) {
      set({
        popup: {
          type: "error",
          message: "Failed to remove schema",
          data: null,
          action: null,
        },
      });
    } finally {
      get().stopLoading();
    }
  },
});
export default testSlice;
