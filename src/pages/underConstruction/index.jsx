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
    if (editingNewSectionName.trim()) {
      updateSection(editingSectionName, editingNewSectionName.trim());
      setEditingSectionName(null);
      setEditingNewSectionName("");
    }
  };

  const cancelEditing = () => {
    setEditingSectionName(null);
    setEditingNewSectionName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {/* Loading & Popups */}
      {loading && <LoadingScreen />}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={closePopup}
          onConfirm={popup.onConfirm}
          confirmText={popup.confirmText}
          cancelText={popup.cancelText}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Schema Builder</h1>
          <div className="mt-2 sm:mt-0">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium text-sm">
              Under Construction Mode
            </span>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Basic Information</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <InputField
                label="Schema Name"
                value={schema.name || ""}
                onChange={(e) => setSchema("name", e.target.value)}
                placeholder="e.g., Complete Blood Count Panel"
              />
              <InputField
                label="Display Test Name"
                value={schema.testName || ""}
                onChange={(e) => setSchema("testName", e.target.value)}
                placeholder="e.g., CBC with Differential"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-300 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <p className="text-xs text-gray-600">Is this schema active?</p>
                </div>
                <select
                  value={schema.isActive}
                  onChange={handleIsActiveChange}
                  className="mt-2 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={false}>Draft</option>
                  <option value={true}>Active</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Selection Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Selection</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectField
                label="Test Category"
                value={schema.categoryId || ""}
                onChange={handleCategoryChange}
                options={testList.map((cat) => ({
                  value: cat._id,
                  label: cat.categoryName,
                }))}
                placeholder="Select category"
              />
              <SelectField
                label="Specific Test"
                value={schema.testId || ""}
                onChange={(e) => setSchema("testId", e.target.value)}
                disabled={!schema.categoryId}
                options={testsForSelectedCategory.map((test) => ({
                  value: test._id,
                  label: `${test.name}${test.schemaId ? " (has schema)" : ""}`,
                }))}
                placeholder="Select test"
              />
            </div>

            {schema.testId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-blue-500 text-2xl mr-3">Info</span>
                  <div>
                    <p className="font-medium text-blue-800">Selected Test</p>
                    <p className="text-sm text-blue-700">
                      Schema will be attached to:{" "}
                      <strong>{testsForSelectedCategory.find((t) => t._id === schema.testId)?.name}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sections Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Sections</h3>
            <p className="text-sm text-gray-600 mt-1">Organize fields into logical groups</p>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <InputField
                label="New Section Title"
                value={schema.currentSectionName || ""}
                onChange={(e) => setSchema("currentSectionName", e.target.value)}
                placeholder="e.g., Hematology, Chemistry Panel, Urinalysis"
              />
              <button
                onClick={addSection}
                disabled={!schema.currentSectionName?.trim()}
                className="mt-3 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Add Section
              </button>
            </div>

            {schema.sections?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Existing Sections ({schema.sections.length})
                </h4>
                <div className="space-y-3">
                  {schema.sections.map((section) => (
                    <div
                      key={section.name}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow"
                    >
                      {editingSectionName === section.name ? (
                        <div className="space-y-3">
                          <InputField
                            value={editingNewSectionName}
                            onChange={(e) => setEditingNewSectionName(e.target.value)}
                            placeholder="Edit section name"
                            autoFocus
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={saveEditing}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h5 className="font-semibold text-gray-900">{section.name}</h5>
                            <p className="text-sm text-gray-500 mt-1">{section.fields?.length || 0} field(s)</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => startEditing(section)}
                              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                            >
                              Edit Name
                            </button>
                            <button
                              onClick={() => deleteSection(section.name)}
                              disabled={schema.sections.length === 1}
                              className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors disabled:opacity-50"
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

        {/* Standard Range Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Static Standard Range</h3>
              <p className="text-sm text-gray-600">Optional fixed reference values for the entire test</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={schema.hasStandardRange || false}
                  onChange={(e) => handleStandardRangeToggle(e.target.checked)}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors ${
                    schema.hasStandardRange ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    schema.hasStandardRange ? "translate-x-6" : ""
                  }`}
                />
              </div>
              <span className="ml-3 text-gray-700 font-medium">{schema.hasStandardRange ? "Enabled" : "Disabled"}</span>
            </label>
          </div>

          {schema.hasStandardRange && (
            <div className="p-4 sm:p-6">
              <TextAreaField
                label="Reference Values (Text)"
                value={schema.standardRange || ""}
                onChange={(e) => setSchema("standardRange", e.target.value)}
                placeholder="Normal: 12–15 g/dL&#10;Low: {'<'} 12 g/dL&#10;High: {'>'} 15 g/dL"
                rows={8}
              />
            </div>
          )}
        </div>

        {/* JSON Preview Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Live JSON Preview</h3>
          </div>
          <div className="p-4 sm:p-6 bg-gray-50">
            <pre className="text-xs sm:text-sm font-mono bg-white p-5 rounded-lg border border-gray-200 overflow-x-auto max-h-96 whitespace-pre-wrap break-words">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        </div>

        {/* Save Button (you can connect this later) */}
        <div className="flex justify-center pt-6">
          <button className="px-12 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg">
            Save Schema (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
