import { useEffect, useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
import Icons from "../../components/icons";

const CategoryForm = () => {
  const { addCategory, editCategory, modal, closeModal } = useStore();
  const [name, setName] = useState(modal?.data?.name || "");

  const handleSubmit = () => {
    if (modal.view === "addCategory") {
      addCategory(name);
    } else if (modal.view === "editCategory") {
      editCategory(modal.data.categoryId, name);
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
            {modal.view === "addCategory" ? "Create New Category" : "Edit Category"}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {modal.view === "addCategory" && (
          <div className="flex flex-col space-y-2">
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              label="Category Name"
              type="text"
            />
          </div>
        )}

        {modal.view === "editCategory" && (
          <div className="flex flex-col space-y-2">
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              label="Category Name"
              type="text"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
          >
            <Icons.Add className="w-4 h-4" />
            {modal.view === "addCategory" ? "Create Category" : "Update Category"}
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

export default CategoryForm;
