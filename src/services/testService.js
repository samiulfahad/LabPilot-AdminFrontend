import api from "./api";

const testService = {
  addTest: (data) => api.post("/lab/test/add", data),
  editTest: (data) => api.patch("/lab/test/edit", data),
  deleteTest: (testId) => api.delete(`/lab/test/delete/${testId}`),
  geTestList: () => api.get("/lab/test/all"),
  setSchema: (categoryId, testId, schemaId) => api.patch("/lab/test/setTestSchema", { categoryId, testId, schemaId }),
  unsetSchema: (categoryId, testId) => api.patch("/lab/test/setTestSchema", { categoryId, testId }),
};

export default testService;
