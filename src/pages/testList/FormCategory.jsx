import { useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
const CategoryForm = () => {
  const { addCategory } = useStore();
  const [name, setName] = useState("");

  return (
    <div>
      <InputField value={name} onChange={(e) => setName(e.target.value)} label="Category Name" type="text" />
      <button onClick={() => addCategory(name)} className="add-btn m-4">
        Save Category
      </button>
    </div>
  );
};

export default CategoryForm;
