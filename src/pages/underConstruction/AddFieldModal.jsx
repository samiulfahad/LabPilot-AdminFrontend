// Updated AddFieldModal.js with conditional fields for options and maxLength
import { useState, useEffect } from "react";
import useStore from "./store";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";

const AddFieldModal = () => {
  const { schema, addField, closeModal, setPopup } = useStore();
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("input");
  const [isRequired, setIsRequired] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingOptionValue, setEditingOptionValue] = useState("");

  const sections = schema.sections || [];
  const hasMultipleSections = sections.length > 1;

  useEffect(() => {
    if (!hasMultipleSections && sections.length > 0) {
      setSelectedSection(sections[0].name);
    }
  }, [sections, hasMultipleSections]);

  const needsOptions = ["select", "checkbox", "radio"].includes(fieldType);
  const needsMaxLength = ["input", "textarea"].includes(fieldType);

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

  const handleSubmit = () => {
    if (!fieldName.trim()) {
      setPopup({ type: "error", message: "Field name is required" });
      return;
    }

    if (hasMultipleSections && !selectedSection) {
      setPopup({ type: "error", message: "Please select a section" });
      return;
    }

    // Check for unique field name across all sections
    const allFields = sections.flatMap((section) => section.fields || []);
    if (allFields.some((f) => f.name === fieldName)) {
      setPopup({ type: "error", message: "Field name must be unique" });
      return;
    }

    if (needsOptions && options.length === 0) {
      setPopup({ type: "error", message: "At least one option is required for this field type" });
      return;
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

    addField(sectionName, newField);

    // Show success and close
    setPopup({ type: "success", message: "Field added successfully" });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 overflow-y-auto max-h-[80vh]">
        <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
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
          {needsOptions && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-800">Options</h4>
              {/* List of options */}
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
              {/* Add new option */}
              <div className="flex gap-2">
                <InputField
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Enter new option"
                  className="flex-1"
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

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              Add Field
            </button>
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;
