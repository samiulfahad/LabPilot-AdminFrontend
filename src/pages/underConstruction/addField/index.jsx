// Updated AddField.js (add unit input for number type)
import { useState, useEffect } from "react";
import useStore from "../store";
import InputField from "../../../components/html/InputField";
import SelectField from "../../../components/html/SelectField";
import FieldOptionsEditor from "./FieldOptionsEditor"; // NEW IMPORT
import StandardRangeEditor from "./StandardRangeEditor"; // NEW IMPORT

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
  const [unit, setUnit] = useState(""); // NEW: State for unit

  const sections = schema.sections || [];
  const hasMultipleSections = sections.length > 1;

  useEffect(() => {
    if (!hasMultipleSections && sections.length > 0) {
      setSelectedSection(sections[0].name);
    }
  }, [sections, hasMultipleSections]);

  const needsOptions = ["select", "checkbox", "radio"].includes(fieldType);
  const needsMaxLength = ["input", "textarea"].includes(fieldType);
  const needsStandardRange = fieldType === "number" && standardRangeType !== "none";

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
    if (fieldType === "number" && standardRangeType !== "none") {
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
      } else if ((standardRangeType === "age" || standardRangeType === "age_gender") && rangeData.length === 0) {
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

    if (needsOptions) {
      newField.options = options;
    }

    if (needsMaxLength && maxLength) {
      newField.maxLength = parseInt(maxLength, 10);
    }

    if (needsStandardRange) {
      newField.standardRange = {
        type: standardRangeType,
        data: rangeData,
      };
    }

    if (fieldType === "number" && unit.trim()) {
      newField.unit = unit.trim(); // NEW: Add unit if provided
    }

    addField(sectionName, newField);

    setPopup({ type: "success", message: "Field added successfully" });
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
    setUnit(""); // NEW: Reset unit
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

      {/* Add Field Form */}
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
                placeholder="Select section"
              />
            )}
            {!hasMultipleSections && sections.length > 0 && (
              <p className="text-sm text-gray-600">Attaching to default section: {sections[0].name}</p>
            )}
            <InputField
              label="Field Name (unique ID)"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g., email_address"
            />
            <SelectField
              label="Field Type"
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
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mark as required</span>
            </label>

            {/* Conditional: Max Length for input and textarea */}
            {needsMaxLength && (
              <InputField
                label="Max Length (optional)"
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
                placeholder="e.g., 255"
              />
            )}

            {/* Conditional: Options for select, checkbox, radio */}
            {needsOptions && <FieldOptionsEditor options={options} setOptions={setOptions} />}

            {/* Conditional: Unit and Standard Range for number */}
            {fieldType === "number" && (
              <>
                <InputField
                  label="Unit (optional)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., kg, cm, %"
                />
                <StandardRangeEditor
                  standardRangeType={standardRangeType}
                  setStandardRangeType={setStandardRangeType}
                  rangeData={rangeData}
                  setRangeData={setRangeData}
                />
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

      {/* Optionally, add a list of existing fields here later */}
    </div>
  );
};

export default AddField;
