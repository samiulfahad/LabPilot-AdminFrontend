import api from "./api";

const testService = {
  addTest: (data) => api.post("/lab/test/add", data),
  editTest: (data) => api.patch("/lab/test/edit", data),
  deleteTest: (testId) => api.delete(`/lab/test/delete/${testId}`),
  getTestList: () => api.get("/lab/test/all"),
  setSchema: ( testId, schemaId) => api.patch("/lab/test/setTestSchema", { testId, schemaId }),
  unsetSchema: (testId) => api.patch("/lab/test/setTestSchema", { testId }),
};

export default testService;
