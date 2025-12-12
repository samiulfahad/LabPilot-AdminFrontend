import { useEffect, useState } from "react";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
import useStore from "./store";
import Icons from "../../components/icons";

const TestForm = () => {
  const { addTest, editTest, categoryList, loadCategoryList, modal, closeModal } = useStore();
  const [name, setName] = useState(modal?.data?.name || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(modal?.data?.categoryId || "");

  useEffect(() => {
    loadCategoryList();
  }, []);


  
  const categoryOptions = categoryList.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const handleSubmit = () => {
    if (modal.view === "addTest") {
      addTest(selectedCategoryId, name);
    } else if (modal.view === "editTest") {
      console.log("Test Id- " + modal.data.testId);
      console.log("Category Id- " + selectedCategoryId);
      console.log("Name- " + modal.data.name);
      editTest(modal.data.testId, selectedCategoryId, name);
    }
  };

  return (
    <div className="p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icons.Details className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {modal.view === "addTest" ? "Create New Test" : "Edit Test"}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {modal.view === "addTest" && (
          <div className="flex flex-col space-y-2">
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              label="Test Name"
              type="text"
              placeholder="Enter test name"
            />
            <SelectField
              label="Category"
              name="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>
        )}

        {modal.view === "editTest" && (
          <div className="flex flex-col space-y-2">
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              label="Test Name"
              type="text"
              placeholder="Enter test name"
            />
            <SelectField
              label="Category"
              name="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
          >
            <Icons.Add className="w-4 h-4" />
            {modal.view === "addTest" ? "Create Test" : "Update Test"}
          </button>

          <button
            onClick={closeModal}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
