import useStore from "./store";
const SchemaPreview = () => {
  const { schema } = useStore();

  const safeStringify = (obj) => {
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "function" || value instanceof HTMLElement) return undefined;
        return value;
      },
      2
    );
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Schema Preview</h3>
          <p className="text-sm text-gray-600">Live preview of schema data structure</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {schema.sections?.length || 0} section(s)
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              schema.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {schema.isActive ? "Active" : "Draft"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              schema.hasStandardRange ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {schema.hasStandardRange ? "Standard Range" : "No Range"}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200">
        <div className="p-2">
          <pre className="text-xs md:text-sm text-green-600 font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-gray-900  p-1 rounded border">
            {safeStringify(schema)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemaPreview;
