import { useEffect, useState } from "react";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
import TextAreaField from "../../components/html/TextAreaField";
import useStore from "./store";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";

const UnderConstruction = () => {
  const {
    schema,
    setSchema,
    addSection,
    deleteSection,
    updateSection,
    testList,
    loadTestList,
    popup,
    closePopup,
    loading,
    clearStandardRange,
    confirmRemoveStandardRange,
  } = useStore();

  const [editingSectionName, setEditingSectionName] = useState(null);
  const [editingNewSectionName, setEditingNewSectionName] = useState("");

  useEffect(() => {
    loadTestList();
  }, [loadTestList]);

  const testsForSelectedCategory = schema.categoryId
    ? testList.find((cat) => cat._id === schema.categoryId)?.tests || []
    : [];

  const handleCategoryChange = (e) => {
    setSchema("categoryId", e.target.value);
    setSchema("testId", "");
  };

  const handleStandardRangeToggle = (value) => {
    if (!value && schema.standardRange?.trim() !== "") {
      confirmRemoveStandardRange();
    } else {
      setSchema("hasStandardRange", value);
      if (!value) clearStandardRange();
    }
  };

  const handleIsActiveChange = (e) => {
    setSchema("isActive", e.target.value === "true");
  };

  const startEditing = (section) => {
    setEditingSectionName(section.name);
    setEditingNewSectionName(section.name);
  };

  const saveEditing = () => {
    if (editingSectionName && editingNewSectionName.trim()) {
      updateSection(editingSectionName, editingNewSectionName);
      setEditingSectionName(null);
      setEditingNewSectionName("");
    }
  };

  const cancelEditing = () => {
    setEditingSectionName(null);
    setEditingNewSectionName("");
  };

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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}

      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center sm:text-left px-2 sm:px-0">
            Schema Builder
          </h2>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Basic Information</h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <InputField label="Schema Name" value={schema.name} onChange={(e) => setSchema("name", e.target.value)} />
              <InputField
                label="Test Name"
                value={schema.testName}
                onChange={(e) => setSchema("testName", e.target.value)}
              />
              <SelectField
                label="Status"
                value={schema.isActive.toString()}
                onChange={handleIsActiveChange}
                options={[
                  { label: "Draft", value: "false" },
                  { label: "Active", value: "true" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Selection</h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <SelectField
                label="Test Category"
                value={schema.categoryId}
                onChange={handleCategoryChange}
                options={testList.map((category) => ({
                  value: category._id,
                  label: category.categoryName,
                }))}
                placeholder="Choose a category"
              />
              <SelectField
                label="Specific Test"
                value={schema.testId}
                onChange={(e) => setSchema("testId", e.target.value)}
                options={testsForSelectedCategory.map((test) => ({
                  value: test._id,
                  label: `${test.name}${test.schemaId ? " ✓" : ""}`,
                }))}
                placeholder="Select a test"
                disabled={!schema.categoryId}
              />
            </div>
          </div>
        </div>

        {/* Sections Feature */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Sections</h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <InputField
                  label="Section Title"
                  value={schema.currentSectionName || ""}
                  onChange={(e) => setSchema("currentSectionName", e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
              <div className="sm:self-end">
                <button
                  onClick={() => addSection()}
                  disabled={!schema.currentSectionName?.trim()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
                >
                  Add New Section
                </button>
              </div>
            </div>

            {schema.sections?.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Sections ({schema.sections.length})
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {schema.sections.map((section) => (
                    <div key={section.name} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      {editingSectionName === section.name ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingNewSectionName}
                            onChange={(e) => setEditingNewSectionName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Section name"
                            autoFocus
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={saveEditing}
                              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                          <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{section.name}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(section)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSection(section.name)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={schema.sections.length === 1}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Standard Range Feature */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Add Static Standard Range</h3>
                <p className="text-xs sm:text-sm text-gray-600">Set reference values for this schema</p>
              </div>
              <button
                onClick={() => handleStandardRangeToggle(!schema.hasStandardRange)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  schema.hasStandardRange
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {schema.hasStandardRange ? "Disable" : "Enable"} Standard Range
              </button>
            </div>

            {schema.hasStandardRange && (
              <div className="pt-2">
                <TextAreaField
                  label="Reference Values"
                  value={schema.standardRange}
                  onChange={(e) => setSchema("standardRange", e.target.value)}
                  placeholder="Enter standard ranges, reference values, and normal parameters..."
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>

        {/* Schema Preview */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Schema Preview</h3>
                <p className="text-xs sm:text-sm text-gray-600">Live preview of schema data structure</p>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{schema.sections?.length || 0} section(s)</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 bg-gray-50">
            <div className="text-xs sm:text-sm text-gray-600 mb-3 space-y-1">
              <div>
                <strong>Category:</strong>{" "}
                {schema.categoryId
                  ? testList.find((cat) => cat._id === schema.categoryId)?.categoryName
                  : "Not selected"}
              </div>
              <div>
                <strong>Test:</strong>{" "}
                {schema.testId
                  ? testsForSelectedCategory.find((test) => test._id === schema.testId)?.name
                  : "Not selected"}
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded border border-gray-200 overflow-x-auto">
              <pre className="text-xs sm:text-sm text-gray-700 font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                {safeStringify(schema)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
