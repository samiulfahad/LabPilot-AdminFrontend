import { useEffect } from "react";
import SelectField from "../../components/html/SelectField";
import useStore from "./store";
const SelectTest = () => {
  const { loadTestList, testList, schema, setSchema } = useStore();

  useEffect(() => {
    loadTestList();
  }, []);

  const handleCategoryChange = (e) => {
    setSchema("categoryId", e.target.value);
    setSchema("testId", "");
  };

  const testsForSelectedCategory = schema.categoryId
    ? testList.find((cat) => cat._id === schema.categoryId)?.tests || []
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Test Category"
          value={schema.categoryId}
          onChange={handleCategoryChange}
          options={testList.map((category) => ({
            value: category._id,
            label: category.categoryName,
          }))}
          placeholder="Select a category"
        />
        <SelectField
          label="Specific Test"
          value={schema.testId}
          onChange={(e) => setSchema("testId", e.target.value)}
          options={testsForSelectedCategory.map((test) => ({
            value: test._id,
            label: `${test.name}${test.schemaId ? " (Attached)" : ""}`,
          }))}
          placeholder="Select a test"
          disabled={!schema.categoryId}
        />
      </div>
    </div>
  );
};

export default SelectTest;
