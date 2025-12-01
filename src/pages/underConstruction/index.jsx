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
  const [showAddSectionInput, setShowAddSectionInput] = useState(false);

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
    setSchema("isActive", e.target.checked);
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

  const handleAddSectionClick = () => {
    addSection();
    setShowAddSectionInput(false);
  };

  const handleCancelAddSection = () => {
    setSchema("currentSectionName", "");
    setShowAddSectionInput(false);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Schema Builder</h1>
        </div>

        {/* Row 1: Schema Name & Test Name */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Row 2: Test Category & Test Selection */}
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
                label: `${test.name}${test.schemaId ? " ✓" : ""}`,
              }))}
              placeholder="Select a test"
              disabled={!schema.categoryId}
            />
          </div>
        </div>

        {/* Row 3: Status Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Status</h3>
              <p className="text-sm text-gray-600 mt-1">
                {schema.isActive ? "Schema is active and can be used" : "Schema is in draft mode"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schema.isActive}
                onChange={handleIsActiveChange}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">{schema.isActive ? "Active" : "Draft"}</span>
            </label>
          </div>
        </div>

        {/* Row 4: Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sections</h3>
              <p className="text-sm text-gray-600 mt-1">Organize test fields into sections</p>
            </div>
            {!showAddSectionInput && (
              <button
                onClick={() => setShowAddSectionInput(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Add Section
              </button>
            )}
          </div>

          {/* Add Section Input */}
          {showAddSectionInput && (
            <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <InputField
                label="Section Title"
                value={schema.currentSectionName || ""}
                onChange={(e) => setSchema("currentSectionName", e.target.value)}
                placeholder="Enter section title (e.g., Hematology, Biochemistry)"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddSectionClick}
                  disabled={!schema.currentSectionName?.trim()}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Add Section
                </button>
                <button
                  onClick={handleCancelAddSection}
                  className="flex-1 px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Sections List */}
          {schema.sections?.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Existing Sections ({schema.sections.length})</h4>
                {schema.sections.length === 1 && (
                  <span className="text-xs text-gray-500">Default section is required</span>
                )}
              </div>
              <div className="space-y-3">
                {schema.sections.map((section) => (
                  <div key={section.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {editingSectionName === section.name ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingNewSectionName}
                          onChange={(e) => setEditingNewSectionName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Section name"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditing}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">{section.name}</span>
                          {section.name === "Default" && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Default</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(section)}
                            className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSection(section.name)}
                            className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Row 5: Standard Range */}
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
                placeholder="Enter standard ranges, reference values, and normal parameters...\n\nExample:\nNormal: 12–15 g/dL\nLow: < 12 g/dL\nHigh: > 15 g/dL"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Row 6: Schema Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
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
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
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
            </div>

            <div className="p-4">
              <pre className="text-xs md:text-sm text-gray-700 font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-white p-3 rounded border">
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
