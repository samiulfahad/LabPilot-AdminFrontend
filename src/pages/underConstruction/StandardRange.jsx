import useStore from "./store";
import TextAreaField from "../../components/html/TextAreaField"
const StandardRange = () => {
  const { schema, setSchema, clearStandardRange } = useStore();

  const handleStandardRangeToggle = (value) => {
    if (!value && schema.standardRange?.trim() !== "") {
      confirmRemoveStandardRange();
    } else {
      setSchema("hasStandardRange", value);
      if (!value) clearStandardRange();
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Standard Range</h3>
          <p className="text-sm text-gray-600 mt-1">Add static reference values for this test</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={schema.hasStandardRange}
            onChange={(e) => handleStandardRangeToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {schema.hasStandardRange ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>

      {schema.hasStandardRange && (
        <div className="mt-4">
          <TextAreaField
            label="Reference Values"
            value={schema.standardRange}
            onChange={(e) => setSchema("standardRange", e.target.value)}
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

export default StandardRange;
