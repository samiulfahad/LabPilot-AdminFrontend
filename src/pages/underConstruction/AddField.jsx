import { useState, useEffect } from "react";
import useStore from "./store";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
const AddField = () => {
  const { schema, addField, setPopup } = useStore();
  const [showAddFieldForm, setShowAddFieldForm] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("input");
  const [isRequired, setIsRequired] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [options, setOptions] = useState([]);
  const [standardRangeType, setStandardRangeType] = useState("none");
  const [rangeData, setRangeData] = useState(null);
  const [unit, setUnit] = useState("");
  // FieldOptionsEditor states & logic (inlined)
  const [newOption, setNewOption] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingOptionValue, setEditingOptionValue] = useState("");
  // StandardRangeEditor states & logic (inlined)
  const [newRangeEntry, setNewRangeEntry] = useState({});
  const [editingRangeIndex, setEditingRangeIndex] = useState(null);
  const sections = schema.sections || [];
  const hasMultipleSections = sections.length > 1;
  useEffect(() => {
    if (!hasMultipleSections && sections.length > 0) {
      setSelectedSection(sections[0].name);
    }
  }, [sections, hasMultipleSections]);
  // Reset child states when field type changes
  useEffect(() => {
    if (!["select", "checkbox", "radio"].includes(fieldType)) {
      setOptions([]);
      setNewOption("");
      setEditingOptionIndex(null);
      setEditingOptionValue("");
    }
    if (fieldType !== "number") {
      setUnit("");
      setStandardRangeType("none");
      // rangeData, newRangeEntry, editingRangeIndex will be reset by the effect below
    }
  }, [fieldType]);
  // Reset range data when standardRangeType changes
  useEffect(() => {
    if (standardRangeType === "simple") {
      setRangeData({ min: "", max: "" });
    } else if (standardRangeType === "gender") {
      setRangeData({ male: { min: "", max: "" }, female: { min: "", max: "" } });
    } else if (standardRangeType === "age" || standardRangeType === "combined") {
      setRangeData([]);
    } else {
      setRangeData(null);
    }
    setNewRangeEntry({});
    setEditingRangeIndex(null);
  }, [standardRangeType]);
  const needsOptions = ["select", "checkbox", "radio"].includes(fieldType);
  const needsMaxLength = ["input", "textarea"].includes(fieldType);
  const needsStandardRange = fieldType === "number" && standardRangeType !== "none";
  // FieldOptionsEditor handlers
  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };
  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };
  const handleStartEditOption = (index, value) => {
    setEditingOptionIndex(index);
    setEditingOptionValue(value);
  };
  const handleSaveEditOption = () => {
    if (editingOptionValue.trim()) {
      const updatedOptions = [...options];
      updatedOptions[editingOptionIndex] = editingOptionValue.trim();
      setOptions(updatedOptions);
      setEditingOptionIndex(null);
      setEditingOptionValue("");
    }
  };
  const handleCancelEditOption = () => {
    setEditingOptionIndex(null);
    setEditingOptionValue("");
  };
  // StandardRangeEditor handlers
  const handleSimpleOrGenderChange = (key, subKey, value) => {
    setRangeData((prev) => ({
      ...prev,
      [key]: subKey ? { ...prev[key], [subKey]: value } : value,
    }));
  };
  const handleNewRangeChange = (key, value) => {
    setNewRangeEntry((prev) => ({ ...prev, [key]: value }));
  };
  const validateRangeEntry = (entry, type) => {
    if (type === "age") {
      return entry.minAge && entry.minValue && entry.maxValue;
    } else if (type === "combined") {
      return entry.gender && entry.minAge && entry.minValue && entry.maxValue;
    }
    return false;
  };
  const handleAddOrUpdateRange = () => {
    if (validateRangeEntry(newRangeEntry, standardRangeType)) {
      const entry = { ...newRangeEntry };
      if (!entry.maxAge) entry.maxAge = 999;
      if (editingRangeIndex !== null) {
        const updated = [...rangeData];
        updated[editingRangeIndex] = entry;
        setRangeData(updated);
        setEditingRangeIndex(null);
        setPopup({ type: "success", message: "Range updated successfully" });
      } else {
        setRangeData((prev) => [...prev, entry]);
        setPopup({ type: "success", message: "Range added successfully" });
      }
      setNewRangeEntry({});
    } else {
      setPopup({ type: "error", message: "Please fill all required fields for the range" });
    }
  };
  const handleRemoveRange = (index) => {
    setRangeData((prev) => prev.filter((_, i) => i !== index));
  };
  const handleStartEditRange = (index) => {
    setEditingRangeIndex(index);
    setNewRangeEntry({ ...rangeData[index] });
  };
  const handleCancelEditRange = () => {
    setEditingRangeIndex(null);
    setNewRangeEntry({});
  };
  const handleSubmit = () => {
    if (!fieldName.trim()) {
      setPopup({ type: "error", message: "Field name is required" });
      return;
    }
    if (hasMultipleSections && !selectedSection) {
      setPopup({ type: "error", message: "Please select a section" });
      return;
    }
    const allFields = sections.flatMap((section) => section.fields || []);
    if (allFields.some((f) => f.name === fieldName)) {
      setPopup({ type: "error", message: "Field name must be unique" });
      return;
    }
    if (needsOptions && options.length === 0) {
      setPopup({ type: "error", message: "At least one option is required for this field type" });
      return;
    }
    // Validate standard range if enabled
    if (needsStandardRange) {
      if (standardRangeType === "simple") {
        if (!rangeData.min || !rangeData.max) {
          setPopup({ type: "error", message: "Min and max required for simple range" });
          return;
        }
      } else if (standardRangeType === "gender") {
        if (!rangeData.male.min || !rangeData.male.max || !rangeData.female.min || !rangeData.female.max) {
          setPopup({ type: "error", message: "Min and max required for both genders" });
          return;
        }
      } else if ((standardRangeType === "age" || standardRangeType === "combined") && rangeData.length === 0) {
        setPopup({ type: "error", message: "At least one range required" });
        return;
      }
    }
    const sectionName = selectedSection || sections[0].name;
    const newField = {
      name: fieldName,
      type: fieldType,
      required: isRequired,
    };
    if (needsOptions) newField.options = options;
    if (needsMaxLength && maxLength) newField.maxLength = parseInt(maxLength, 10);
    if (needsStandardRange) {
      newField.standardRange = { type: standardRangeType, data: rangeData };
    }
    if (fieldType === "number" && unit.trim()) {
      newField.unit = unit.trim();
    }
    addField(sectionName, newField);
    resetForm();
  };
  const resetForm = () => {
    setFieldName("");
    setFieldType("input");
    setIsRequired(false);
    setMaxLength("");
    setOptions([]);
    setStandardRangeType("none");
    setRangeData(null);
    setUnit("");
    setNewOption("");
    setEditingOptionIndex(null);
    setEditingOptionValue("");
    setNewRangeEntry({});
    setEditingRangeIndex(null);
    if (!hasMultipleSections && sections.length > 0) {
      setSelectedSection(sections[0].name);
    } else {
      setSelectedSection("");
    }
    setShowAddFieldForm(false);
  };
  const handleCancel = () => {
    resetForm();
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Fields</h3>
          <p className="text-sm text-gray-600 mt-1">Add fields to sections</p>
        </div>
        {!showAddFieldForm && (
          <button
            onClick={() => setShowAddFieldForm(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Add Field
          </button>
        )}
      </div>
      {showAddFieldForm && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-md font-semibold mb-3">Add New Field</h4>
          <div className="space-y-4">
            {hasMultipleSections && (
              <SelectField
                label="Attach to Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={sections.map((sec) => ({
                  value: sec.name,
                  label: sec.name,
                }))}
              />
            )}
            {!hasMultipleSections && sections.length > 0 && (
              <p className="text-sm text-gray-600">Attaching to default section: {sections[0].name}</p>
            )}
            <InputField label="Field Name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
            <SelectField
              label="Type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              options={[
                { value: "input", label: "Text Input" },
                { value: "select", label: "Select Dropdown" },
                { value: "checkbox", label: "Checkbox Group" },
                { value: "radio", label: "Radio Group" },
                { value: "textarea", label: "Textarea" },
                { value: "number", label: "Number Input" },
              ]}
            />
            {needsMaxLength && (
              <InputField
                label="Max Length"
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
              />
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mark as required</span>
            </label>
            {/* Inlined FieldOptionsEditor */}
            {needsOptions && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-800">Options</h5>
                {options.length > 0 && (
                  <div className="space-y-2">
                    {options.map((opt, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        {editingOptionIndex === index ? (
                          <>
                            <input
                              type="text"
                              value={editingOptionValue}
                              onChange={(e) => setEditingOptionValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              autoFocus
                            />
                            <button onClick={handleSaveEditOption} className="text-xs text-green-600 hover:underline">
                              Save
                            </button>
                            <button onClick={handleCancelEditOption} className="text-xs text-gray-600 hover:underline">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm text-gray-900">{opt}</span>
                            <button
                              onClick={() => handleStartEditOption(index, opt)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveOption(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-center items-center gap-2">
                  <InputField
                    label="Label"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-1 !pl-3"
                  />
                  <button
                    onClick={handleAddOption}
                    disabled={!newOption.trim()}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            {/* Number-specific fields (unit + inlined StandardRangeEditor) */}
            {fieldType === "number" && (
              <>
                <InputField label="Unit (optional)" value={unit} onChange={(e) => setUnit(e.target.value)} />
                {/* Inlined StandardRangeEditor */}
                <div className="space-y-4">
                  <SelectField
                    label="Standard Range Type"
                    value={standardRangeType}
                    onChange={(e) => setStandardRangeType(e.target.value)}
                    options={[
                      { value: "none", label: "No Standard Range" },
                      { value: "simple", label: "Simple Range" },
                      { value: "age", label: "Age Based" },
                      { value: "gender", label: "Gender Based" },
                      { value: "combined", label: "Combined (Age and Gender)" },
                    ]}
                  />
                  {standardRangeType === "simple" && rangeData && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Min Value"
                        type="number"
                        value={rangeData.min || ""}
                        onChange={(e) => handleSimpleOrGenderChange("min", null, e.target.value)}
                      />
                      <InputField
                        label="Max Value"
                        type="number"
                        value={rangeData.max || ""}
                        onChange={(e) => handleSimpleOrGenderChange("max", null, e.target.value)}
                      />
                    </div>
                  )}
                  {standardRangeType === "gender" && rangeData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Male Min"
                          type="number"
                          value={rangeData.male?.min || ""}
                          onChange={(e) => handleSimpleOrGenderChange("male", "min", e.target.value)}
                        />
                        <InputField
                          label="Male Max"
                          type="number"
                          value={rangeData.male?.max || ""}
                          onChange={(e) => handleSimpleOrGenderChange("male", "max", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Female Min"
                          type="number"
                          value={rangeData.female?.min || ""}
                          onChange={(e) => handleSimpleOrGenderChange("female", "min", e.target.value)}
                        />
                        <InputField
                          label="Female Max"
                          type="number"
                          value={rangeData.female?.max || ""}
                          onChange={(e) => handleSimpleOrGenderChange("female", "max", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {(standardRangeType === "age" || standardRangeType === "combined") && rangeData && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-800">Ranges</h5>
                      {rangeData.length > 0 && (
                        <div className="space-y-2">
                          {rangeData.map((range, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                              <span className="flex-1 text-sm text-gray-900">
                                {standardRangeType === "combined"
                                  ? `${range.gender.charAt(0).toUpperCase() + range.gender.slice(1)} `
                                  : ""}
                                Age {range.minAge}-{range.maxAge === 999 ? "+" : range.maxAge}: {range.minValue}-
                                {range.maxValue}
                              </span>
                              <button
                                onClick={() => handleStartEditRange(index)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemoveRange(index)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-2">
                        <div
                          className={`grid gap-2 ${standardRangeType === "combined" ? "grid-cols-3" : "grid-cols-2"}`}
                        >
                          {standardRangeType === "combined" && (
                            <SelectField
                              label="Gender"
                              value={newRangeEntry.gender || ""}
                              onChange={(e) => handleNewRangeChange("gender", e.target.value)}
                              options={[
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                              ]}
                            />
                          )}
                          <InputField
                            label="Min Age"
                            type="number"
                            value={newRangeEntry.minAge || ""}
                            onChange={(e) => handleNewRangeChange("minAge", e.target.value)}
                          />
                          <InputField
                            label="Max Age"
                            type="number"
                            value={newRangeEntry.maxAge || ""}
                            onChange={(e) => handleNewRangeChange("maxAge", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <InputField
                            label="Min Value"
                            type="number"
                            value={newRangeEntry.minValue || ""}
                            onChange={(e) => handleNewRangeChange("minValue", e.target.value)}
                          />
                          <InputField
                            label="Max Value"
                            type="number"
                            value={newRangeEntry.maxValue || ""}
                            onChange={(e) => handleNewRangeChange("maxValue", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleAddOrUpdateRange}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          disabled={!validateRangeEntry(newRangeEntry, standardRangeType)}
                        >
                          {editingRangeIndex !== null ? "Update Range" : "Add Range"}
                        </button>
                        {editingRangeIndex !== null && (
                          <button
                            onClick={handleCancelEditRange}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Add Field
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddField;
