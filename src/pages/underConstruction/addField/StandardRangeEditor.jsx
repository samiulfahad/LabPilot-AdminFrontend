// src/components/schema/StandardRangeEditor.js
import { useState, useEffect } from "react";
import useStore from "./../store";
import InputField from "../../../components/html/InputField";
import SelectField from "../../../components/html/SelectField";

const StandardRangeEditor = ({ standardRangeType, setStandardRangeType, rangeData, setRangeData }) => {
  const { setPopup } = useStore();
  const [newRangeEntry, setNewRangeEntry] = useState({});
  const [editingRangeIndex, setEditingRangeIndex] = useState(null);

  useEffect(() => {
    if (standardRangeType === "simple") {
      setRangeData({ min: "", max: "" });
    } else if (standardRangeType === "gender") {
      setRangeData({ male: { min: "", max: "" }, female: { min: "", max: "" } });
    } else if (standardRangeType === "age" || standardRangeType === "age_gender") {
      setRangeData([]);
    } else {
      setRangeData(null);
    }
    setNewRangeEntry({});
    setEditingRangeIndex(null);
  }, [standardRangeType, setRangeData]);

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
    } else if (type === "age_gender") {
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
    setNewRangeEntry({ ...rangeData[index] }); // Copy to edit
  };

  const handleCancelEditRange = () => {
    setEditingRangeIndex(null);
    setNewRangeEntry({});
  };

  return (
    <div className="space-y-3">
      <SelectField
        label="Standard Range Type"
        value={standardRangeType}
        onChange={(e) => setStandardRangeType(e.target.value)}
        options={[
          { value: "none", label: "No Standard Range" },
          { value: "simple", label: "Simple Range" },
          { value: "age", label: "Age Based" },
          { value: "gender", label: "Gender Based" },
          { value: "age_gender", label: "Age and Gender Based" },
        ]}
      />
      {standardRangeType === "simple" && rangeData && (
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Min Value"
            type="number"
            value={rangeData.min}
            onChange={(e) => handleSimpleOrGenderChange("min", null, e.target.value)}
          />
          <InputField
            label="Max Value"
            type="number"
            value={rangeData.max}
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
              value={rangeData.male.min}
              onChange={(e) => handleSimpleOrGenderChange("male", "min", e.target.value)}
            />
            <InputField
              label="Male Max"
              type="number"
              value={rangeData.male.max}
              onChange={(e) => handleSimpleOrGenderChange("male", "max", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Female Min"
              type="number"
              value={rangeData.female.min}
              onChange={(e) => handleSimpleOrGenderChange("female", "min", e.target.value)}
            />
            <InputField
              label="Female Max"
              type="number"
              value={rangeData.female.max}
              onChange={(e) => handleSimpleOrGenderChange("female", "max", e.target.value)}
            />
          </div>
        </div>
      )}
      {(standardRangeType === "age" || standardRangeType === "age_gender") && rangeData && (
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-gray-800">Ranges</h5>
          {rangeData.length > 0 && (
            <div className="space-y-2">
              {rangeData.map((range, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1 text-sm text-gray-900">
                    {standardRangeType === "age_gender" ? `${range.gender} ` : ""}
                    Age {range.minAge}-{range.maxAge === 999 ? "+" : range.maxAge}: {range.minValue}-{range.maxValue}
                  </span>
                  <button onClick={() => handleStartEditRange(index)} className="text-xs text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleRemoveRange(index)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Single form for add/edit */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
            {standardRangeType === "age_gender" && (
              <SelectField
                value={newRangeEntry.gender || ""}
                onChange={(e) => handleNewRangeChange("gender", e.target.value)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                placeholder="Gender"
              />
            )}
            <InputField
              type="number"
              value={newRangeEntry.minAge || ""}
              onChange={(e) => handleNewRangeChange("minAge", e.target.value)}
              placeholder="Min Age"
            />
            <InputField
              type="number"
              value={newRangeEntry.maxAge || ""}
              onChange={(e) => handleNewRangeChange("maxAge", e.target.value)}
              placeholder="Max Age (opt)"
            />
            <InputField
              type="number"
              value={newRangeEntry.minValue || ""}
              onChange={(e) => handleNewRangeChange("minValue", e.target.value)}
              placeholder="Min Value"
            />
            <InputField
              type="number"
              value={newRangeEntry.maxValue || ""}
              onChange={(e) => handleNewRangeChange("maxValue", e.target.value)}
              placeholder="Max Value"
            />
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
  );
};

export default StandardRangeEditor;
