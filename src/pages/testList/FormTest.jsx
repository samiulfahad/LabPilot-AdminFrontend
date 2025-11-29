import { useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
const TestForm = () => {
  const { addTest, editTest, modal, closeModal } = useStore();
  const categoryId = modal.data.categoryId;
  console.log(modal.data);
  const testId = modal.data.testId;
  const [name, setName] = useState(modal.view === "editTestForm" ? modal.data.testName : "");

  return (
    <div>
      <InputField value={name} onChange={(e) => setName(e.target.value.toUpperCase())} label="Test Name" type="text" />
      <button
        onClick={() => (modal.view === "addTestForm" ? addTest(categoryId, name) : editTest(categoryId, testId, name))}
        className="add-btn m-4"
      >
        {modal.view === "addTestForm" ? "Add Test" : "Edit Test"}
      </button>

      <button onClick={closeModal} className="close-btn">
        Cancel
      </button>
    </div>
  );
};

export default TestForm;
