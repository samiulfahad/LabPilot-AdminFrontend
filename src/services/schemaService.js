import api from "./api";

const schemaService = {
  getAll: (params) => api.get("/schema/all", { params }),
  getById: (schemaId) => api.get(`/schema/search/${schemaId}`),
  // getByTestId: (testId) => api.get(`/schema/${testId}`), // Fixed endpoint
  getByTestId: (testId, isActive) => api.get(`/schema/${testId}`, { params: { isActive } }),
  getByCategoryId: (categoryId) => api.get(`schema/category/${categoryId}`), // Fixed endpoint
  addNew: (data) => api.post("/schema/add", data),
  update: (schemaId, data) => api.put("/schema/update", { schemaId, ...data }),
  delete: (schemaId) => api.delete(`/schema/delete/${schemaId}`),
  activate: (schemaId) => api.patch(`/schema/activate/${schemaId}`),
  deactivate: (schemaId) => api.patch(`/schema/deactivate/${schemaId}`),
};

export default schemaService;
