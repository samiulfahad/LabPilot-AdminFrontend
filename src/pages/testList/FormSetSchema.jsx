import { useEffect, useState } from "react";
import InputField from "../../components/html/InputField";
import useStore from "./store";
import { Link } from "react-router-dom";
const SetSchemaForm = () => {
  const { testAssociatedSchemaList, loadTestSchema, modal, setDefaultSchema, closeModal } = useStore();
  const categoryId = modal.data.categoryId;
  const testId = modal.data.testId;

  useEffect(() => {
    loadTestSchema(testId);
  }, [testId, loadTestSchema]);

  return (
    <div>
      {testAssociatedSchemaList.map((schema) => (
        <div key={schema._id}>
          <div className="flex m-1 justify-between items-center">
            <p>{schema.name}</p>

            <Link
              to={`/render-schema/${schema._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-gray-300"
            >
              View Schema
            </Link>

            <button onClick={() => setDefaultSchema(testId, schema._id)} className="px-2 py-1 bg-gray-300">
              Set As Default
            </button>
          </div>
        </div>
      ))}

      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default SetSchemaForm;
