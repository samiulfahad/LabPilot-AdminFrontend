import { useState, useEffect } from "react";

import Modal from "../../components/modal";
import Form from "./Form";
import Category from "./Category";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";
import testService from "../../services/testService";

const Tests = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [form, setForm] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (form.type === "addCategory") {
        console.log(form.categoryName);
        const response = await testService.addCategory({ categoryName: form.categoryName });
        // Push the new category without reloading
        setCategories((prev) => [...prev, response.data]);
        setPopup({ type: "success", message: "Test Category Added Successfully" });
      }

      if (form.type === "editCategory") {
        const response = await testService.editCategory({
          categoryId: form.categoryId,
          categoryName: form.categoryName,
        });
        // Update the edited category in the DOM
        setCategories((prev) =>
          prev.map((category) =>
            category._id === form.categoryId ? { ...category, categoryName: form.categoryName.toUpperCase() } : category
          )
        );
        setPopup({ type: "success", message: "Category renamed successfully" });
      }

      if (form.type === "addTest") {
        const data = { categoryId: form.categoryId, testName: form.testName, isOnline: form.isOnline };
        console.log(data);
        const response = await testService.addTest(data);
        // console.log(response.data);
        setCategories((prev) =>
          prev.map((category) => (category._id === response.data._id ? response.data : category))
        );
        setPopup({ type: "success", message: "Test added successfully" });
      }

      if (form.type === "editTest") {
        const data = {
          categoryId: form.categoryId,
          testId: form.testId,
          testName: form.testName,
          isOnline: form.isOnline,
        };
        console.log(data);
        const response = await testService.editTest(data);
        // console.log(response.data);
        setCategories((prev) =>
          prev.map((category) => (category._id === response.data._id ? response.data : category))
        );
        setPopup({ type: "success", message: "Test edited successfully" });
      }

      setForm(null);
      setIsModalOpen(false);
    } catch (e) {
      // console.log(e);
      let message = "Could not complete operation";
      if (e.response?.data?.duplicate) message = "This name is already present";
      setPopup({ type: "error", message: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (popup.delete === "category") {
        const response = await testService.deleteCategory(popup.categoryId);
        // Remove the category from the array without reloading
        setCategories((prev) => prev.filter((item) => item._id !== popup.categoryId));
        setPopup({ type: "success", message: "Category Deleted Successfully" });
      }

      if (popup.delete === "test") {
        const response = await testService.deleteTest(popup.categoryId, popup.testId);
        // Remove test from the array without reloading
        setCategories((prev) =>
          prev.map((category) =>
            category._id === popup.categoryId
              ? {
                  ...category,
                  tests: category.tests.filter((test) => test._id !== popup.testId),
                }
              : category
          )
        );
        setPopup({ type: "success", message: "Test Deleted Successfully" });
      }
    } catch (e) {
      setPopup({
        type: "error",
        message: "Something went wrong. Item was not deleted",
      });
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setForm(null);
  };

  const handleFormData = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await testService.getAllTests();
      console.log(response.data);
      setCategories(response.data);
    } catch (err) {
      setPopup({ type: "error", message: "Could not load test categories" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <section>
      {loading && <LoadingScreen />}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={handleDelete}
          confirmText="Yes, Delete"
        />
      )}
      <div className="space-y-4 mt-4 px-2">
        <div className="min-w-full flex justify-center items-center">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setForm({ type: "addCategory" });
            }}
            className="add-btn flex !px-4 !py-2"
          >
            Add Test Category
          </button>
        </div>
        {/* Modal */}
        <Modal isOpen={isModalOpen} size="sm">
          <Form
            onSubmit={handleSubmit}
            formType={form?.type}
            data={form}
            onChange={handleFormData}
            onClose={handleClose}
          />
        </Modal>
        {categories.map((category) => (
          <Category
            key={category._id}
            name={category.categoryName}
            tests={category.tests}
            onEditCategory={() => {
              setForm({
                categoryName: category.categoryName,
                type: "editCategory",
                categoryId: category._id,
              });
              setIsModalOpen(true);
            }}
            onDeleteCategory={() => {
              setPopup({
                type: "confirmation",
                message: `You are going to delete test category - ${category.categoryName}`,
                categoryId: category._id,
                delete: "category",
              });
            }}
            onAddTest={() => {
              setForm({ type: "addTest", categoryId: category._id });
              setIsModalOpen(true);
            }}
            onEditTest={(testId, testName, isOnline) => {
              setForm({
                type: "editTest",
                categoryId: category._id,
                testId: testId,
                testName: testName,
                isOnline: isOnline,
              });
              setIsModalOpen(true);
            }}
            onDeleteTest={(testId, testName) => {
              setPopup({
                type: "confirmation",
                message: `You are going to delete test - ${testName} under category ${category.categoryName}`,
                categoryId: category._id,
                testId: testId,
                delete: "test",
              });
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Tests;
