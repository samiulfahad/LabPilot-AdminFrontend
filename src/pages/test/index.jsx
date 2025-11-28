import { useState, useEffect } from "react";

import Modal from "../../components/modal";
import Category from "./Category";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";
import labTestService from "../../services/testService";
import schemaService from "../../services/schemaService";
import TestCategoryForm from "./FormTestCategory";
import LabTestForm from "./FormLabTest";
import DefaultSchemaModal from "./DefaultSchemaModal";

const Tests = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [form, setForm] = useState({});
  const [schemas, setSchemas] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  const loadSchema = async (testId) => {
    try {
      setLoading(true);
      console.log("Loading schemas for test:", testId);
      const response = await schemaService.getByTestId(testId);
      console.log(response.data);
      setSchemas(response.data);
    } catch (e) {
      setPopup({ type: "error", message: "Could not load schemas" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (form.type === "addCategory") {
        console.log(form);
        const response = await labTestService.addCategory({ categoryName: form.categoryName });
        setCategories((prev) => [...prev, response.data]);
        setPopup({ type: "success", message: "Test Category Added Successfully" });
      }

      if (form.type === "editCategory") {
        const response = await labTestService.editCategory({
          categoryId: form.categoryId,
          categoryName: form.categoryName,
        });
        setCategories((prev) =>
          prev.map((category) =>
            category._id === form.categoryId ? { ...category, categoryName: form.categoryName.toUpperCase() } : category
          )
        );
        setPopup({ type: "success", message: "Category renamed successfully" });
      }

      if (form.type === "addLabTest") {
        const data = { categoryId: form.categoryId, name: form.name };
        console.log(data);
        const response = await labTestService.addLabTest(data);
        setCategories((prev) =>
          prev.map((category) => (category._id === response.data._id ? response.data : category))
        );
        setPopup({ type: "success", message: "Test added successfully" });
      }

      if (form.type === "editLabTest") {
        const data = {
          categoryId: form.categoryId,
          testId: form.testId,
          name: form.name,
        };
        console.log(data);
        const response = await labTestService.editTest(data);
        setCategories((prev) =>
          prev.map((category) => (category._id === response.data._id ? response.data : category))
        );
        setPopup({ type: "success", message: "Test edited successfully" });
      }

      setForm({});
      setModal({});
    } catch (e) {
      let message = "Could not complete operation";
      if (e.response?.data?.duplicate) message = "This name is already present";
      setPopup({ type: "error", message: message });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultSchema = async (testId, schemaId) => {
    try {
      setLoading(true);
      const response = await labTestService.setDefaultSchema(testId, schemaId);

      // Update the categories state
      setCategories((prev) =>
        prev.map((category) => ({
          ...category,
          tests: category.tests.map((test) => (test._id === testId ? { ...test, defaultSchema: schemaId } : test)),
        }))
      );

      setPopup({ type: "success", message: "Default schema set successfully" });
      setModal({});
    } catch (e) {
      setPopup({ type: "error", message: "Failed to set default schema" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (popup.delete === "category") {
        const response = await labTestService.deleteCategory(popup.categoryId);
        setCategories((prev) => prev.filter((item) => item._id !== popup.categoryId));
        setPopup({ type: "success", message: "Category Deleted Successfully" });
      }

      if (popup.delete === "test") {
        const response = await labTestService.deleteTest(popup.categoryId, popup.testId);
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
      setPopup({ type: "error", message: "Something went wrong. Item was not deleted" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModal({});
    setForm({});
    setSelectedTest(null);
  };

  const handleFormChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await labTestService.getAllTests();
      setCategories(response.data);
    } catch (err) {
      setPopup({ type: "error", message: "Could not load test categories" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDefaultSchemaModal = async (test) => {
    setSelectedTest(test);
    await loadSchema(test._id);
    setModal({ isOpen: true, type: "defaultSchema" });
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
              setModal({ isOpen: true });
              setForm({ type: "addCategory" });
            }}
            className="add-btn"
          >
            Add Test Category
          </button>
        </div>

        {/* Modal */}
        <Modal isOpen={modal.isOpen} size="sm">
          {(form?.type === "addCategory" || form?.type === "editCategory") && (
            <TestCategoryForm
              onSubmit={handleSubmit}
              formType={form.type}
              data={form}
              categoryId={form.categoryId}
              onChange={handleFormChange}
              onClose={handleClose}
            />
          )}

          {(form?.type === "addLabTest" || form?.type === "editLabTest") && (
            <LabTestForm
              onSubmit={handleSubmit}
              formType={form.type}
              data={form}
              onChange={handleFormChange}
              onClose={handleClose}
            />
          )}

          {modal.type === "defaultSchema" && selectedTest && (
            <DefaultSchemaModal
              test={selectedTest}
              schemas={schemas}
              onSetDefault={handleSetDefaultSchema}
              onClose={handleClose}
            />
          )}
        </Modal>

        {categories.map((category) => (
          <Category
            key={category._id}
            name={category.categoryName}
            tests={category.tests}
            onEditCategory={() => {
              setForm({
                type: "editCategory",
                categoryName: category.categoryName,
                categoryId: category._id,
              });
              setModal({ isOpen: true, type: "editCategory" });
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
              setForm({ type: "addLabTest", categoryId: category._id });
              setModal({ isOpen: true });
            }}
            onEditTest={(test) => {
              setForm({
                type: "editLabTest",
                categoryId: category._id,
                testId: test._id,
                name: test.name,
              });
              setModal({ isOpen: true });
            }}
            onSetDefaultSchema={handleOpenDefaultSchemaModal}
            onDeleteTest={(testId, name) => {
              setPopup({
                type: "confirmation",
                message: `You are going to delete test - ${name} under category ${category.categoryName}`,
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
