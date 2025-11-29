import { useEffect } from "react";
import useStore from "./store";
import { Link } from "react-router-dom";
const SetSchemaForm = () => {
  const { testAssociatedSchemaList, loadTestSchema, modal, setSchema, closeModal } = useStore();
  const categoryId = modal.data.categoryId;
  const testId = modal.data.testId;
  const selectedSchema = modal.data.selectedSchema;

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

            {schema._id === selectedSchema ? (
              <p className="px-2 py-1 bg-green-500">Selected</p>
            ) : (
              <button onClick={() => setSchema(categoryId, testId, schema._id)} className="px-2 py-1 bg-gray-300">
                Set As Default
              </button>
            )}
          </div>
        </div>
      ))}

      <button className="close-btn" onClick={closeModal}>Close</button>
    </div>
  );
};

export default SetSchemaForm;
