import api from "./api";

const testCategoryService = {
  addCategory: (data) => api.post("/lab/testCategory/add", data),
  editCategory: (data) => api.patch("/lab/testCategory/edit", data),
  deleteCategory: (categoryId) => api.delete(`/lab/testCategory/delete/${categoryId}`),
  getCategoryList: () => api.get("/lab/testCategory/all"),
  getPopulatedList: () => api.get("/lab/testCategory/populate"),
};

export default testCategoryService;
