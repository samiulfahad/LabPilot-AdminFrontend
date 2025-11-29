import { useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
import Icons from "../../components/icons";

const TestForm = () => {
  const { addTest, editTest, modal, closeModal } = useStore();
  const categoryId = modal.data.categoryId;
  const testId = modal.data.testId;
  const [name, setName] = useState(modal.view === "editTestForm" ? modal.data.testName : "");

  const handleSubmit = () => {
    if (modal.view === "addTestForm") {
      addTest(categoryId, name);
    } else {
      editTest(categoryId, testId, name);
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
            {modal.view === "addTestForm" ? "Create New Test" : "Edit Test"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {modal.view === "addTestForm" ? "Add a new test to this category" : "Update test details"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <InputField
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          label="Test Name"
          type="text"
          placeholder="Enter test name"
        />

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
          >
            <Icons.Add className="w-4 h-4" />
            {modal.view === "addTestForm" ? "Create Test" : "Update Test"}
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
