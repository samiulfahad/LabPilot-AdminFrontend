import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import schemaService from "../../services/schemaService";
import testService from "../../services/testService";
import Popup from "../../components/popup/Popup";
import SelectField from "../../components/html/SelectField";
import LoadingScreen from "../../components/loadingPage";
import Schema from "./Schema";

const SchemaList = () => {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [availableTests, setAvailableTests] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await testService.getAllTests();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setPopup({ type: "error", message: "Failed to load categories" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all schemas
  const fetchAllSchemas = async () => {
    try {
      setLoading(true);
      resetFilters();
      const response = await schemaService.getAll();
      setSchemas(response.data || []);
      console.log(response.data[0]);
      if (response.data?.length === 0) {
        setPopup({ type: "error", message: "No schemas found" });
      }
    } catch (error) {
      console.error("Error fetching schemas:", error);
      setPopup({ type: "error", message: "Failed to load schemas" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch schema by test ID
  const fetchSchemaByTest = async (testId) => {
    try {
      setLoading(true);
      const response = await schemaService.getByTestId(testId);
      if (response.data) {
        setSchemas(response.data);
      } else {
        setSchemas([]);
        setPopup({ type: "error", message: "No schema found for selected test" });
      }
    } catch (error) {
      console.error("Error fetching schema:", error);
      setPopup({ type: "error", message: "Failed to load schema" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch schemas by category
  const fetchSchemasByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await schemaService.getByCategoryId(categoryId);
      setSchemas(response.data || []);
      if (response.data?.length === 0) {
        setPopup({ type: "error", message: "No schemas found for this category" });
      }
    } catch (error) {
      console.error("Error fetching schemas:", error);
      setPopup({ type: "error", message: "Failed to load schemas" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await schemaService.delete(popup._id);
      setSchemas((prev) => prev.filter((schema) => schema._id !== popup._id));
      setPopup({ type: "success", message: "Schema deleted successfully" });
    } catch (error) {
      console.error("Error deleting schema:", error);
      setPopup({ type: "error", message: "Failed to delete schema" });
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedTest("");

    if (categoryId) {
      const category = categories.find((cat) => cat._id === categoryId);
      setAvailableTests(category?.tests || []);
    } else {
      setAvailableTests([]);
    }
  };

  // Handle test selection
  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
  };

  // Handle fetch action
  const handleFetch = () => {
    if (selectedTest) {
      fetchSchemaByTest(selectedTest);
    } else if (selectedCategory) {
      fetchSchemasByCategory(selectedCategory);
    } else {
      setPopup({ type: "error", message: "Please select a category first" });
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTest("");
    setAvailableTests([]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Prepare options for SelectField components
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));

  const testOptions = availableTests.map((test) => ({
    value: test._id,
    label: test.testName,
  }));

  const selectedCategoryName = categories.find((c) => c._id === selectedCategory)?.categoryName;
  const selectedTestName = availableTests.find((t) => t._id === selectedTest)?.testName;

  return (
    <div className="min-h-screen bg-gray-50/30 py-2">
      {loading && <LoadingScreen />}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={popup.type === "confirmation" ? handleDelete : null}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Test Schemas</h1>
          </div>
          <Link
            to="/schema-builder"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Schema
          </Link>
        </div>
      </div>

      {/* Filters Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <SelectField
                label="Category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Select Category"
              />
            </div>

            {/* Test Dropdown */}
            <div className="md:col-span-4">
              <SelectField
                label="Test"
                name="test"
                value={selectedTest}
                onChange={handleTestChange}
                disabled={!selectedCategory}
                options={testOptions}
                placeholder="Select Test"
              />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-4 flex gap-3">
              <button
                onClick={handleFetch}
                disabled={!selectedCategory}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Fetch
              </button>
              <button
                onClick={fetchAllSchemas}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View All
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedTest) && (
            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                {selectedCategoryName && (
                  <>
                    <span className="font-medium">{selectedCategoryName}</span>
                    {selectedTestName && <span className="mx-2">•</span>}
                  </>
                )}
                {selectedTestName && <span className="font-medium">{selectedTestName}</span>}
              </div>
              <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {schemas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schemas found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {selectedCategory || selectedTest
                ? "No schemas match your current selection."
                : "Get started by creating your first test schema."}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={fetchAllSchemas} className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                View All Schemas
              </button>
              <Link
                to="/schema-builder"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Schema
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Schemas</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {schemas.length} schema{schemas.length !== 1 ? "s" : ""} found
                  {selectedCategoryName && ` • Filtered by ${selectedCategoryName}`}
                  {selectedTestName && ` • ${selectedTestName}`}
                </p>
              </div>
              {(selectedCategory || selectedTest) && (
                <button onClick={resetFilters} className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                  Clear filters
                </button>
              )}
            </div>

            {/* Schemas Grid */}
            <div className="space-y-4">
              {
                console.log(schemas)
              }
              {schemas.map((schema, index) => (
                // In your SchemaList component, update the Schema component usage:
                <Schema
                  key={schema._id}
                  input={schema}
                  index={index}
                  onDelete={() =>
                    setPopup({
                      type: "confirmation",
                      message: `Do you want to delete the schema "${schema.testName}"?`,
                      _id: schema._id,
                    })
                  }
                  onActivate={() =>
                    setPopup({
                      type: "confirmation",
                      message: `Do you want to activate the schema "${schema.testName}"?`,
                      _id: schema._id,
                      action: "activate",
                    })
                  }
                  onDeactivate={() =>
                    setPopup({
                      type: "confirmation",
                      message: `Do you want to deactivate the schema "${schema.testName}"?`,
                      _id: schema._id,
                      action: "deactivate",
                    })
                  }
                  onSetDefault={() =>
                    setPopup({
                      type: "confirmation",
                      message: `Do you want to set "${schema.testName}" as the default schema?`,
                      _id: schema._id,
                      action: "setDefault",
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaList;
