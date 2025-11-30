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
    <div className="min-h-screen bg-slate-50 py-8">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className=" text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Schema Builder
          </h1>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-slate-900">Test Selection</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Schema Features */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Multi-section Feature */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Multi-section</h3>
                  </div>
                  <SelectField
                    label=""
                    value={schema.hasMultiSection.toString()}
                    onChange={handleMultiSectionChange}
                    options={[
                      { label: "Disabled", value: "false" },
                      { label: "Enabled", value: "true" },
                    ]}
                  />
                </div>

                {schema.hasMultiSection && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <InputField
                          label=""
                          value={schema.currentSectionName || ""}
                          onChange={(e) => setSchema("currentSectionName", e.target.value)}
                          placeholder="New section name"
                        />
                      </div>
                      <button
                        onClick={() => addSection()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap self-end"
                      >
                        Add
                      </button>
                    </div>

                    {schema.sections?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-3">Sections ({schema.sections.length})</h4>
                        <div className="space-y-2">
                          {schema.sections.map((section) => (
                            <div key={section.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                              {editingSectionId === section.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editingSectionName}
                                    onChange={(e) => setEditingSectionName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Section name"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={saveEditing}
                                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditing}
                                      className="flex-1 px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-slate-900">{section.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">{section.id}</div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => startEditing(section)}
                                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => deleteSection(section.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      🗑️
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

              {/* Standard Range Feature */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Standard Range</h3>
                  </div>
                  <div>
                    {!schema.hasStandardRange ? (
                      <button
                        onClick={() => handleStandardRangeToggle(true)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Enable
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStandardRangeToggle(false)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        Disable
                      </button>
                    )}
                  </div>
                </div>

                {schema.hasStandardRange && (
                  <TextAreaField
                    label="Reference Values"
                    value={schema.standardRange}
                    onChange={(e) => setSchema("standardRange", e.target.value)}
                    placeholder="Enter standard ranges, reference values, and normal parameters..."
                    rows={5}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Schema Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none p-2 hover:bg-slate-50 rounded-lg">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 inline mr-3">Schema Preview</h2>
                  <span className="text-slate-600">View the complete schema data structure</span>
                </div>
                <div className="text-slate-400 group-open:rotate-180 transition-transform">▼</div>
              </summary>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-600">
                    Category:{" "}
                    {schema.categoryId
                      ? testList.find((cat) => cat._id === schema.categoryId)?.categoryName
                      : "Not selected"}
                  </div>
                  <div className="text-sm text-slate-600">
                    Test:{" "}
                    {schema.testId
                      ? testsForSelectedCategory.find((test) => test._id === schema.testId)?.name
                      : "Not selected"}
                  </div>
                </div>
                <pre className="text-sm text-slate-700 bg-white p-4 rounded border overflow-x-auto font-mono">
                  {safeStringify(schema)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
