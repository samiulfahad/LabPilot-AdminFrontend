import { useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
const CategoryForm = () => {
  const { addCategory, editCategory, modal, closeModal } = useStore();
  const categoryId = modal.data?.categoryId;

  const [name, setName] = useState(modal.view === "addCategoryForm" ? "" : modal.data?.categoryName);

  return (
    <div>
      <InputField
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        label="Category Name"
        type="text"
      />
      <button
        onClick={() => (modal.view === "addCategoryForm" ? addCategory(name) : editCategory(categoryId, name))}
        className="add-btn m-4"
      >
        {modal.view === "addCategoryForm" ? "Add Caregory" : "Edit Category"}
      </button>

      <button onClick={closeModal} className="close-btn">
        Cancel
      </button>
    </div>
  );
};

export default CategoryForm;
