import api from "./api";

const labTestService = {
  addLabTest: (data) => api.post("/lab/test/add", data),
  editTest: (data) => api.patch("/lab/test/edit", data),
  deleteTest: (categoryId, testId) => api.delete("/lab/test/delete", { params: { categoryId, testId } }),
  getAllTests: () => api.get("/lab/test/category/all"),
  addCategory: (data) => api.post("/lab/test/category/add", data),
  editCategory: (data) => api.patch("/lab/test/category/edit", data),
  deleteCategory: (categoryId) => api.delete(`/lab/test/category/delete/${categoryId}`),
  setSchema: (categoryId, testId, schemaId) => api.patch("/lab/test/setTestSchema", { categoryId, testId, schemaId }),
  unsetSchema: (categoryId, testId) => api.patch("/lab/test/setTestSchema", { categoryId, testId }),
};

export default labTestService;
