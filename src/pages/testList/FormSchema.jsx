import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "./store";
import schemaService from "../../services/schemaService";
import LoadingScreen from "../../components/loadingPage";

const SchemaForm = () => {
  const { setSchema, loadTestSchema, testAssociatedSchemaList, loading, modal, closeModal } = useStore();
  const { testId, schemaId } = modal?.data;

  useEffect(() => {
    loadTestSchema(testId);
  }, []);

  return (
    <div className="p-6 max-w-lg w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Schema</h2>

      {loading && <LoadingScreen />}

      {testAssociatedSchemaList.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-gray-700 font-medium">No Schema Found</p>
          <p className="text-gray-500 text-sm mt-1">No schemas available for this test</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {testAssociatedSchemaList.map((schema) => (
            <div
              key={schema._id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                schemaId === schema._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-8 rounded-full ${schemaId === schema._id ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <div>
                  <p className="font-medium text-gray-800">{schema.name}</p>
                  {schema.description && <p className="text-sm text-gray-500">Description: {schema.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Button - Always visible */}
                <Link
                  to={`/render-schema/${schema._id}`}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 active:scale-95 transition-all text-sm"
                >
                  View
                </Link>

                {/* Active badge or Select button */}
                {schemaId === schema._id ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => setSchema(testId, schema._id)}
                    className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={closeModal}
          className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SchemaForm;
