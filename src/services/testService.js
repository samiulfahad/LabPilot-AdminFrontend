import api from "./api";

const testService = {
  addTest: (data) => api.post("/test/add", data),
  editTest: (data) => api.patch("/test/edit", data),
  deleteTest: (categoryId, testId) => api.delete("/test/delete", { data: { categoryId, testId } }),
  getAllTests: () => api.get("/test/category/all"),
  addCategory: (data) => api.post("/test/category/add", data),
  editCategory: (data) => api.patch("/test/category/edit", data),
  deleteCategory: (_id) => api.delete("/test/category/delete", { data: { categoryId: _id } }),
};

export default testService;
