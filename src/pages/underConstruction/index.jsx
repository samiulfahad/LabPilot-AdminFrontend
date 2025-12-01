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
    clearSections,
    confirmDisableMultiSection,
    confirmRemoveStandardRange,
  } = useStore();

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState("");

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

  const handleMultiSectionChange = (e) => {
    const value = e.target.value === "true";
    if (!value && schema.sections?.length > 0) {
      confirmDisableMultiSection();
    } else {
      setSchema("hasMultiSection", value);
      if (!value) clearSections();
    }
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
    setEditingSectionId(section.id);
    setEditingSectionName(section.name);
  };

  const saveEditing = () => {
    if (editingSectionId && editingSectionName.trim()) {
      updateSection(editingSectionId, editingSectionName);
      setEditingSectionId(null);
      setEditingSectionName("");
    }
  };

  const cancelEditing = () => {
    setEditingSectionId(null);
    setEditingSectionName("");
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
    <div className="min-h-screen max-w-full bg-gray-50 p-4 md:p-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-center">Schema Builder</h1>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  label="Schema Name"
                  value={schema.name}
                  onChange={(e) => setSchema("name", e.target.value)}
                />

                <SelectField
                  label="Status"
                  value={schema.isActive.toString()}
                  onChange={handleIsActiveChange}
                  options={[
                    { label: "🟡 Draft", value: "false" },
                    { label: "🟢 Active", value: "true" },
                  ]}
                />
              </div>

              <InputField
                label="Description"
                value={schema.description}
                onChange={(e) => setSchema("description", e.target.value)}
              />
            </div>
          </div>

          {/* Test Configuration */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Selection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

              {schema.categoryId && (
                <SelectField
                  label="Specific Test"
                  value={schema.testId}
                  onChange={(e) => setSchema("testId", e.target.value)}
                  options={testsForSelectedCategory.map((test) => ({
                    value: test._id,
                    label: `${test.name}${test.schemaId ? " ✓" : ""}`,
                  }))}
                  placeholder="Select a test"
                />
              )}
            </div>
          </div>

          {/* Multi-section Feature */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="md:flex-1">
                  <SelectField
                    label="Multi Section"
                    value={schema.hasMultiSection.toString()}
                    onChange={handleMultiSectionChange}
                    options={[
                      { label: "Disabled", value: "false" },
                      { label: "Enabled", value: "true" },
                    ]}
                  />
                </div>
              </div>

              {schema.hasMultiSection && (
                <div className="space-y-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <InputField
                        label="Section Name"
                        value={schema.currentSectionName || ""}
                        onChange={(e) => setSchema("currentSectionName", e.target.value)}
                        placeholder="New section name"
                      />
                    </div>
                    <button
                      onClick={() => addSection()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add Section
                    </button>
                  </div>

                  {schema.sections?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Sections ({schema.sections.length})</h4>
                      <div className="space-y-2">
                        {schema.sections.map((section) => (
                          <div key={section.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            {editingSectionId === section.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingSectionName}
                                  onChange={(e) => setEditingSectionName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="Section name"
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
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="font-medium text-gray-900">{section.name}</div>
                                  <div className="text-xs text-gray-500 font-mono">{section.id}</div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditing(section)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteSection(section.id)}
                                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
              )}
            </div>
          </div>

          {/* Standard Range Feature */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Add Static Standard Range</h3>
                  <p className="text-sm text-gray-600 mt-1">Set reference values for this schema</p>
                </div>
                <div>
                  {!schema.hasStandardRange ? (
                    <button
                      onClick={() => handleStandardRangeToggle(true)}
                      className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Enable Standard Range
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStandardRangeToggle(false)}
                      className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Disable Standard Range
                    </button>
                  )}
                </div>
              </div>

              {schema.hasStandardRange && (
                <div className="mt-4">
                  <TextAreaField
                    label="Reference Values"
                    value={schema.standardRange}
                    onChange={(e) => setSchema("standardRange", e.target.value)}
                    placeholder="Enter standard ranges, reference values, and normal parameters..."
                    rows={5}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Schema Preview - Always Open */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Schema Preview</h2>
              <p className="text-sm text-gray-600">Live preview of schema data structure</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div className="text-sm text-gray-600">
                  Category:{" "}
                  {schema.categoryId
                    ? testList.find((cat) => cat._id === schema.categoryId)?.categoryName
                    : "Not selected"}
                </div>
                <div className="text-sm text-gray-600">
                  Test:{" "}
                  {schema.testId
                    ? testsForSelectedCategory.find((test) => test._id === schema.testId)?.name
                    : "Not selected"}
                </div>
              </div>
              <pre className="text-xs md:text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto font-mono max-h-96 overflow-y-auto">
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
