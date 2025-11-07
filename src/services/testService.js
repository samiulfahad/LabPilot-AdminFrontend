import api from "./api";

const testService = {
  addTest: (data) => api.post("/lab/test/add", data),
  editTest: (data) => api.patch("/lab/test/edit", data),
  deleteTest: (categoryId, testId) => api.delete("/lab/test/delete", { data: { categoryId, testId } }),
  getAllTests: () => api.get("/lab/test/category/all"),
  addCategory: (data) => api.post("/lab/test/category/add", data),
  editCategory: (data) => api.patch("/lab/test/category/edit", data),
  deleteCategory: (_id) => api.delete("/lab/test/category/delete", { data: { categoryId: _id } }),
};

export default testService;
