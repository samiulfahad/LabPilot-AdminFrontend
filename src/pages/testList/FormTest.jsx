import { useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
const TestForm = () => {
  const { addTest, modal } = useStore();
  const categoryId = modal.data;
  const [name, setName] = useState("");

  return (
    <div>
      <InputField value={name} onChange={(e) => setName(e.target.value)} label="Test Name" type="text" />
      <button onClick={() => addTest(categoryId, name)} className="add-btn m-4">
        Save Test
      </button>
    </div>
  );
};

export default TestForm;
