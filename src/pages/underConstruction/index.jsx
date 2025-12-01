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
    confirmRemoveStandardRange,
    clearStandardRange,
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

  const handleStandardRangeToggle = (enable) => {
    if (!enable && schema.standardRange?.trim()) {
      confirmRemoveStandardRange();
    } else {
      setSchema("hasStandardRange", enable);
      if (!enable) clearStandardRange();
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
      updateSection(editingSectionName, editingNewSectionName.trim());
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
    <div className="min-h-screen bg-gray-50">
      {/* Full-screen loading */}
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}

      {/* Main container - critical for no horizontal scroll */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Schema Builder</h1>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm w-full overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Basic Information</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <InputField
                label="Schema Name"
                value={schema.name}
                onChange={(e) => setSchema("name", e.target.value)}
                placeholder="Enter schema name"
              />
              <InputField
                label="Test Name"
                value={schema.testName}
                onChange={(e) => setSchema("testName", e.target.value)}
                placeholder="Enter test display name"
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

        {/* Test Selection */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm w-full overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Selection</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectField
                label="Test Category"
                value={schema.categoryId}
                onChange={handleCategoryChange}
                options={testList.map((cat) => ({
                  value: cat._id,
                  label: cat.categoryName,
                }))}
                placeholder="Select a category"
              />
              <SelectField
                label="Specific Test"
                value={schema.testId}
                onChange={(e) => setSchema("testId", e.target.value)}
                disabled={!schema.categoryId}
                options={testsForSelectedCategory.map((test) => ({
                  value: test._id,
                  label: `${test.name}${test.schemaId ? " (Attached)" : ""}`,
                }))}
                placeholder="Select a test"
              />
            </div>

            {schema.testId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <div className="flex items-start">
                  <span className="text-blue-400 text-xl mr-3">Info</span>
                  <div>
                    <p className="font-medium text-blue-800">Selected Test</p>
                    <p className="text-blue-700">
                      Schema will be attached to:{" "}
                      <strong>{testsForSelectedCategory.find((t) => t._id === schema.testId)?.name}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm w-full overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Sections</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <InputField
                  label="New Section Title"
                  value={schema.currentSectionName || ""}
                  onChange={(e) => setSchema("currentSectionName", e.target.value)}
                  placeholder="e.g., Hematology, Biochemistry"
                />
              </div>
              <div className="lg:self-end">
                <button
                  onClick={addSection}
                  disabled={!schema.currentSectionName?.trim()}
                  className="w-full lg:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>

            {schema.sections && schema.sections.length > 0 && (
              <div>
                <h4 className="text-base font-semibold text-gray-700 mb-3">
                  Existing Sections ({schema.sections.length})
                </h4>
                <div className="space-y-3">
                  {schema.sections.map((section) => (
                    <div key={section.name} className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-full">
                      {editingSectionName === section.name ? (
                        <div className="space-y-3">
                          <InputField
                            value={editingNewSectionName}
                            onChange={(e) => setEditingNewSectionName(e.target.value)}
                            placeholder="Section name"
                            autoFocus
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={saveEditing}
                              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="font-medium text-gray-900 break-words">{section.name}</div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => startEditing(section)}
                              className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded font-medium text-sm transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSection(section.name)}
                              disabled={schema.sections.length === 1}
                              className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Standard Range */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm w-full overflow-hidden">
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Static Standard Range</h3>
                <p className="text-sm text-gray-600">Add fixed reference values (optional)</p>
              </div>
              <button
                onClick={() => handleStandardRangeToggle(!schema.hasStandardRange)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  schema.hasStandardRange
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {schema.hasStandardRange ? "Disable" : "Enable"} Standard Range
              </button>
            </div>

            {schema.hasStandardRange && (
              <div>
                <TextAreaField
                  label="Reference Values"
                  value={schema.standardRange || ""}
                  onChange={(e) => setSchema("standardRange", e.target.value)}
                  placeholder="e.g., Normal: 12-15 g/dL\nLow: < 12 g/dL\nHigh: > 15 g/dL"
                  rows={8}
                />
              </div>
            )}
          </div>
        </div>

        {/* Schema Preview */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm w-full overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Schema Preview</h3>
            <p className="text-sm text-gray-600">Live JSON structure</p>
          </div>
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="text-xs sm:text-sm text-gray-600 mb-3 space-y-1">
              <div>
                <strong>Category:</strong>{" "}
                {schema.categoryId
                  ? testList.find((c) => c._id === schema.categoryId)?.categoryName || "—"
                  : "Not selected"}
              </div>
              <div>
                <strong>Test:</strong>{" "}
                {schema.testId
                  ? testsForSelectedCategory.find((t) => t._id === schema.testId)?.name || "—"
                  : "Not selected"}
              </div>
            </div>
            <pre className="text-xs sm:text-sm bg-white p-4 rounded-lg border border-gray-200 font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-96">
              {safeStringify(schema)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
