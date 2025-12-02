// New component: FieldOptionsEditor.js
import { useState } from "react";
import InputField from "../../../components/html/InputField";

const FieldOptionsEditor = ({ options, setOptions }) => {
  const [newOption, setNewOption] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingOptionValue, setEditingOptionValue] = useState("");

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

  return (
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
                  <button onClick={() => handleRemoveOption(index)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
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
  );
};

export default FieldOptionsEditor;
