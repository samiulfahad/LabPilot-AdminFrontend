import api from "./api";

const schemaService = {
  getAll: (params) => api.get("/test/schema/all", { params }),
  getById: (schemaId) => api.get(`/test/schema/search/${schemaId}`),
  getByTestId: (testId) => api.get(`/test/schema/test/${testId}`), // Fixed endpoint
  getByCategoryId: (categoryId) => api.get(`/test/schema/category/${categoryId}`), // Fixed endpoint
  addNew: (data) => api.post("/test/schema/add", data),
  update: (schemaId, data) => api.put("/test/schema/update", { schemaId, data }),
  delete: (schemaId) => api.delete(`/test/schema/delete/${schemaId}`),
  activate: (schemaId) => api.patch(`/test/schema/activate/${schemaId}`),
  deactivate: (schemaId) => api.patch(`/test/schema/deactivate/${schemaId}`),
};

export default schemaService;
