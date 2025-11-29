import { useEffect } from "react";
import useStore from "./store";
import { Link } from "react-router-dom";
import Icons from "../../components/icons";

const SetSchemaForm = () => {
  const { testAssociatedSchemaList, loadTestSchema, modal, setSchema, closeModal } = useStore();
  const categoryId = modal.data.categoryId;
  const testId = modal.data.testId;
  const selectedSchema = modal.data.selectedSchema;

  useEffect(() => {
    loadTestSchema(testId);
  }, [testId, loadTestSchema]);

  return (
    <div className="p-6 max-w-4xl w-full mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
          <Icons.PowerOn className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configure Schema</h2>
          <p className="text-slate-600 mt-1">Select a schema to power your test</p>
        </div>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
        {testAssociatedSchemaList.map((schema) => (
          <div
            key={schema._id}
            className={`rounded-xl border-2 p-5 transition-all duration-300 ${
              schema._id === selectedSchema
                ? "border-blue-500 bg-blue-50/50 shadow-md"
                : "border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-lg ${schema._id === selectedSchema ? "bg-blue-100" : "bg-slate-100"}`}>
                  <Icons.Details className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${
                      schema._id === selectedSchema ? "text-blue-900" : "text-slate-900"
                    }`}
                  >
                    {schema.name}
                  </h3>
                  {schema._id === selectedSchema && (
                    <p className="text-blue-600 font-medium mt-1">✓ Currently active schema</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/render-schema/${schema._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <Icons.View className="w-4 h-4" />
                  Preview
                </Link>

                {schema._id === selectedSchema ? (
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
                    <Icons.PowerOn className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => setSchema(categoryId, testId, schema._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Icons.PowerOn className="w-4 h-4" />
                    Select
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
        <button
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
          onClick={closeModal}
        >
          <Icons.Close className="w-5 h-5" />
          Close
        </button>
      </div>
    </div>
  );
};

export default SetSchemaForm;
