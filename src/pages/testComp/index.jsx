import React, { useState } from "react";
import InputField from "./InputField";
import SchemaDisplay from "./SchemaDisplay";
import FormPreview from "./FormPreview";

const SchemaBuilderForLabTest = () => {
  const [schema, setSchema] = useState({
    testName: "",
    testDescription: "",
    fields: [],
  });

  const [useSections, setUseSections] = useState(false);
  const [useStandardRange, setUseStandardRange] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    name: "",
    description: "",
  });

  const [currentField, setCurrentField] = useState({
    id: "",
    label: "",
    type: "text",
    required: "no", // Changed from boolean to string
    unit: "",
    standardRange: null,
    options: [],
    sectionId: "",
  });

  const [testStandardRange, setTestStandardRange] = useState({
    type: "options",
    options: [],
    text: "",
  });

  const [newOption, setNewOption] = useState("");
  const [newTestStandardRangeKey, setNewTestStandardRangeKey] = useState("");
  const [newTestStandardRangeValue, setNewTestStandardRangeValue] = useState("");

  // Add a ref to track if we're currently adding a range
  const [isAddingRange, setIsAddingRange] = useState(false);

  // Updated field types
  const fieldTypes = ["text", "textarea", "number", "select", "radio", "checkbox"];

  const standardRangeTypes = [
    { value: "none", label: "No Standard Range" },
    { value: "genderBased", label: "Gender Based Range" },
    { value: "ageBased", label: "Age Based Range" },
    { value: "genderWithAgeBased", label: "Gender and Age Based Range" },
    { value: "numberRange", label: "Number Range Only" },
    { value: "text", label: "Text Reference" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const commonUnits = [
    "",
    "mg/L",
    "mg/dL",
    "g/dL",
    "mmol/L",
    "μmol/L",
    "U/L",
    "IU/L",
    "cells/μL",
    "×10^9/L",
    "mmHg",
    "cm",
    "kg",
    "lb",
    "°C",
    "°F",
  ];

  const initializeStandardRange = (type) => {
    let initialData = { type };

    if (type === "genderBased") {
      initialData.ranges = {
        male: { min: "", max: "" },
        female: { min: "", max: "" },
      };
    } else if (type === "ageBased") {
      initialData.ranges = []; // Start with empty array for age ranges
    } else if (type === "genderWithAgeBased") {
      initialData.ranges = {
        male: [],
        female: [],
      };
    } else if (type === "numberRange") {
      initialData.min = "";
      initialData.max = "";
    } else if (type === "text") {
      initialData.value = "";
    }

    setCurrentField((prev) => ({
      ...prev,
      standardRange: initialData,
    }));
  };

  const handleStandardRangeChange = (path, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

      if (path.includes(".")) {
        const [parent, child, subChild] = path.split(".");
        if (subChild) {
          newStandardRange[parent][child][subChild] = value;
        } else {
          newStandardRange[parent][child] = value;
        }
      } else {
        newStandardRange[path] = value;
      }

      return {
        ...prev,
        standardRange: newStandardRange,
      };
    });
  };

  // Fixed: Add new age range for age-based standard range with proper state tracking
  const addAgeRange = () => {
    if (isAddingRange) return; // Prevent multiple simultaneous calls

    setIsAddingRange(true);

    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

      // Ensure ranges array exists
      if (!newStandardRange.ranges) {
        newStandardRange.ranges = [];
      }

      // Add only ONE new range
      const newRange = {
        ageMin: "",
        ageMax: "",
        min: "",
        max: "",
      };

      // Use functional update to ensure we're working with the latest state
      return {
        ...prev,
        standardRange: {
          ...newStandardRange,
          ranges: [...newStandardRange.ranges, newRange],
        },
      };
    });

    // Reset the flag after a short delay
    setTimeout(() => setIsAddingRange(false), 100);
  };

  // Fixed: Remove age range for age-based standard range
  const removeAgeRange = (index) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
        const newRanges = [...newStandardRange.ranges];
        newRanges.splice(index, 1);
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: newRanges,
          },
        };
      }
      return prev;
    });
  };

  // Fixed: Handle age range changes
  const handleAgeRangeChange = (index, field, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
        const newRanges = [...newStandardRange.ranges];
        newRanges[index] = {
          ...newRanges[index],
          [field]: value,
        };
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: newRanges,
          },
        };
      }
      return prev;
    });
  };

  // Fixed: Add custom age range for gender-age based standard range with proper state tracking
  const addGenderAgeRange = (gender) => {
    if (isAddingRange) return; // Prevent multiple simultaneous calls

    setIsAddingRange(true);

    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

      // Ensure the gender array exists
      if (!newStandardRange.ranges[gender]) {
        newStandardRange.ranges[gender] = [];
      }

      // Add only ONE new range
      const newRange = {
        ageMin: "",
        ageMax: "",
        min: "",
        max: "",
      };

      // Use functional update to ensure we're working with the latest state
      return {
        ...prev,
        standardRange: {
          ...newStandardRange,
          ranges: {
            ...newStandardRange.ranges,
            [gender]: [...newStandardRange.ranges[gender], newRange],
          },
        },
      };
    });

    // Reset the flag after a short delay
    setTimeout(() => setIsAddingRange(false), 100);
  };

  // Fixed: Remove age range for gender-age based standard range
  const removeGenderAgeRange = (gender, index) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
        const newGenderRanges = [...newStandardRange.ranges[gender]];
        newGenderRanges.splice(index, 1);
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: {
              ...newStandardRange.ranges,
              [gender]: newGenderRanges,
            },
          },
        };
      }
      return prev;
    });
  };

  // Fixed: Handle gender-age range changes
  const handleGenderAgeRangeChange = (gender, index, field, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
        const newGenderRanges = [...newStandardRange.ranges[gender]];
        newGenderRanges[index] = {
          ...newGenderRanges[index],
          [field]: value,
        };
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: {
              ...newStandardRange.ranges,
              [gender]: newGenderRanges,
            },
          },
        };
      }
      return prev;
    });
  };

  // ... rest of your existing functions remain the same (addSection, removeSection, etc.)

  const addSection = () => {
    if (!currentSection.name.trim()) {
      alert("Section name is required");
      return;
    }

    // Generate unique section ID automatically
    const sectionId = currentSection.name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();

    const newSection = {
      id: sectionId,
      name: currentSection.name,
      description: currentSection.description,
      fields: [],
    };

    setSchema((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));

    setCurrentSection({
      name: "",
      description: "",
    });
  };

  const removeSection = (index) => {
    setSchema((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const addTestStandardRangeOption = () => {
    if (!newTestStandardRangeKey.trim() || !newTestStandardRangeValue.trim()) return;

    setTestStandardRange((prev) => ({
      ...prev,
      options: [...prev.options, { key: newTestStandardRangeKey.trim(), value: newTestStandardRangeValue.trim() }],
    }));

    setNewTestStandardRangeKey("");
    setNewTestStandardRangeValue("");
  };

  const removeTestStandardRangeOption = (index) => {
    setTestStandardRange((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const addField = () => {
    if (!currentField.label.trim()) {
      alert("Field label is required");
      return;
    }

    // Check for options for radio, select, and checkbox fields
    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length === 0) {
      alert(
        `${currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)} fields must have at least one option`
      );
      return;
    }

    // Generate unique field ID automatically
    const fieldId = currentField.label.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();

    // Convert required from string to boolean for schema
    const isRequired = currentField.required === "yes";

    const fieldData = {
      id: fieldId,
      label: currentField.label,
      type: currentField.type,
      required: isRequired,
      options: currentField.options.length > 0 ? [...currentField.options] : undefined,
    };

    if (currentField.unit && currentField.unit.trim()) {
      fieldData.unit = currentField.unit;
    }

    // Only include standard range for number fields
    if (currentField.type === "number" && currentField.standardRange && currentField.standardRange.type !== "none") {
      const standardRangeData = { ...currentField.standardRange };

      // Clean up empty values for age and genderAge types
      if (standardRangeData.type === "ageBased" && standardRangeData.ranges) {
        standardRangeData.ranges = standardRangeData.ranges.filter((range) => range.min !== "" || range.max !== "");
      } else if (standardRangeData.type === "genderWithAgeBased") {
        Object.keys(standardRangeData.ranges).forEach((gender) => {
          standardRangeData.ranges[gender] = standardRangeData.ranges[gender].filter(
            (range) => range.min !== "" || range.max !== ""
          );
        });
      } else {
        // Existing cleanup logic for other types
        Object.keys(standardRangeData).forEach((key) => {
          if (
            standardRangeData[key] === "" ||
            (Array.isArray(standardRangeData[key]) && standardRangeData[key].length === 0)
          ) {
            delete standardRangeData[key];
          }
        });

        if (standardRangeData.ranges) {
          Object.keys(standardRangeData.ranges).forEach((rangeKey) => {
            if (!standardRangeData.ranges[rangeKey].min && !standardRangeData.ranges[rangeKey].max) {
              delete standardRangeData.ranges[rangeKey];
            }
          });

          if (Object.keys(standardRangeData.ranges).length === 0) {
            delete standardRangeData.ranges;
          }
        }
      }

      if (Object.keys(standardRangeData).length > 0) {
        fieldData.standardRange = standardRangeData;
      }
    }

    if (useSections && currentField.sectionId) {
      setSchema((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === currentField.sectionId ? { ...section, fields: [...section.fields, fieldData] } : section
        ),
      }));
    } else {
      setSchema((prev) => ({
        ...prev,
        fields: [...prev.fields, fieldData],
      }));
    }

    setCurrentField({
      id: "",
      label: "",
      type: "text",
      required: "no",
      unit: "",
      standardRange: null,
      options: [],
      sectionId: useSections ? currentField.sectionId : "",
    });
    setNewOption("");
  };

  const removeField = (sectionIndex, fieldIndex) => {
    if (useSections) {
      setSchema((prev) => ({
        ...prev,
        sections: prev.sections.map((section, sIndex) =>
          sIndex === sectionIndex
            ? { ...section, fields: section.fields.filter((_, fIndex) => fIndex !== fieldIndex) }
            : section
        ),
      }));
    } else {
      setSchema((prev) => ({
        ...prev,
        fields: prev.fields.filter((_, fIndex) => fIndex !== fieldIndex),
      }));
    }
  };

  const addFieldOption = () => {
    if (!newOption.trim()) return;

    setCurrentField((prev) => ({
      ...prev,
      options: [...prev.options, newOption.trim()],
    }));
    setNewOption("");
  };

  const removeFieldOption = (index) => {
    setCurrentField((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const exportSchema = () => {
    const cleanedSchema = {
      ...schema,
      fields: schema.fields
        ? schema.fields.map((field) => {
            const cleanedField = { ...field };
            if (cleanedField.standardRange?.type === "none") {
              delete cleanedField.standardRange;
            }
            if (!cleanedField.unit || cleanedField.unit === "") {
              delete cleanedField.unit;
            }
            return cleanedField;
          })
        : undefined,
      sections: schema.sections
        ? schema.sections.map((section) => ({
            ...section,
            fields: section.fields.map((field) => {
              const cleanedField = { ...field };
              if (cleanedField.standardRange?.type === "none") {
                delete cleanedField.standardRange;
              }
              if (!cleanedField.unit || cleanedField.unit === "") {
                delete cleanedField.unit;
              }
              return cleanedField;
            }),
          }))
        : undefined,
    };

    if (!useSections) {
      delete cleanedSchema.sections;
    }

    if (useStandardRange) {
      const testStandardRangeData = { ...testStandardRange };

      if (testStandardRangeData.type === "options" && testStandardRangeData.options.length > 0) {
        const optionsObj = {};
        testStandardRangeData.options.forEach((option) => {
          optionsObj[option.key] = option.value;
        });
        testStandardRangeData.options = optionsObj;
      } else if (testStandardRangeData.type === "text" && testStandardRangeData.text.trim()) {
      } else {
        delete cleanedSchema.testStandardRange;
      }

      if (Object.keys(testStandardRangeData).length > 0) {
        cleanedSchema.testStandardRange = testStandardRangeData;
      }
    }

    const schemaData = JSON.stringify(cleanedSchema, null, 2);
    const blob = new Blob([schemaData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schema.testName || "lab_test"}_schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSchema = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target.result);
        if (importedSchema.sections && importedSchema.sections.length > 0) {
          setUseSections(true);
        }
        if (importedSchema.testStandardRange) {
          setUseStandardRange(true);
          if (
            importedSchema.testStandardRange.type === "options" &&
            typeof importedSchema.testStandardRange.options === "object"
          ) {
            const optionsArray = Object.entries(importedSchema.testStandardRange.options).map(([key, value]) => ({
              key,
              value,
            }));
            setTestStandardRange({
              ...importedSchema.testStandardRange,
              options: optionsArray,
            });
          } else {
            setTestStandardRange(importedSchema.testStandardRange);
          }
        }
        setSchema(importedSchema);
      } catch (error) {
        alert("Invalid schema file");
      }
    };
    reader.readAsText(file);
  };

  const getFieldsCount = () => {
    if (useSections && schema.sections) {
      return schema.sections.reduce((total, section) => total + section.fields.length, 0);
    }
    return schema.fields.length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center sm:text-left px-2 sm:px-0">
          Lab Report Test Builder
        </h2>

        {/* Schema Builder Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Configuration</h3>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Test Configuration - Updated to be in one row for desktop */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputField
                  label="Test Name"
                  name="testName"
                  value={schema.testName}
                  onChange={(e) => setSchema((prev) => ({ ...prev, testName: e.target.value }))}
                />
                <InputField
                  label="Test Description"
                  name="testDescription"
                  value={schema.testDescription}
                  onChange={(e) => setSchema((prev) => ({ ...prev, testDescription: e.target.value }))}
                />
              </div>
            </div>

            {/* Standard Range Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Standard Range Values</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Add standard range values for the entire test (optional)
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={useStandardRange}
                    onChange={(e) => setUseStandardRange(e.target.checked)}
                  />
                  <div
                    className={`block w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors ${
                      useStandardRange ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-transform ${
                      useStandardRange ? "transform translate-x-6 sm:translate-x-8" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-2 sm:ml-3 text-gray-700 font-medium text-sm">
                  {useStandardRange ? "Enabled" : "Disabled"}
                </div>
              </label>
            </div>

            {/* Standard Range Builder */}
            {useStandardRange && (
              <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Standard Range Values</h4>

                <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                    Standard Range Type
                  </label>
                  <select
                    value={testStandardRange.type}
                    onChange={(e) =>
                      setTestStandardRange((prev) => ({ ...prev, type: e.target.value, options: [], text: "" }))
                    }
                    className="flex-1 px-3 py-2 focus:outline-none bg-white"
                  >
                    <option value="options">Key-Value Options</option>
                    <option value="text">Text Standard Range</option>
                  </select>
                </div>

                {testStandardRange.type === "options" && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Standard Range Values
                      </label>
                      <div className="flex-1 p-3">
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                          {testStandardRange.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-700 block truncate">{option.key}: </span>
                                <span className="text-sm text-gray-600 block truncate">{option.value}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTestStandardRangeOption(index)}
                                className="text-red-600 hover:text-red-800 text-lg font-bold ml-2 flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                          <InputField
                            label="Key"
                            name="testStandardRangeKey"
                            value={newTestStandardRangeKey}
                            onChange={(e) => setNewTestStandardRangeKey(e.target.value)}
                          />
                          <InputField
                            label="Value"
                            name="testStandardRangeValue"
                            value={newTestStandardRangeValue}
                            onChange={(e) => setNewTestStandardRangeValue(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={addTestStandardRangeOption}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {testStandardRange.type === "text" && (
                  <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                      Standard Range Text
                    </label>
                    <textarea
                      value={testStandardRange.text}
                      onChange={(e) => setTestStandardRange((prev) => ({ ...prev, text: e.target.value }))}
                      rows={3}
                      className="flex-1 px-3 py-2 focus:outline-none resize-none text-sm bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sections Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Sections</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Organize test fields into sections (optional)</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={useSections}
                    onChange={(e) => setUseSections(e.target.checked)}
                  />
                  <div
                    className={`block w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors ${
                      useSections ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-transform ${
                      useSections ? "transform translate-x-6 sm:translate-x-8" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-2 sm:ml-3 text-gray-700 font-medium text-sm">
                  {useSections ? "Enabled" : "Disabled"}
                </div>
              </label>
            </div>

            {/* Section Builder */}
            {useSections && (
              <div className="space-y-3">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Manage Test Sections</h4>
                <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {/* Section Inputs in a row for desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Section Name"
                      name="sectionName"
                      value={currentSection.name}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <InputField
                      label="Description"
                      name="sectionDescription"
                      value={currentSection.description}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm sm:text-base transition-colors"
                  >
                    Add Section
                  </button>
                </div>

                {/* Existing Sections - Updated layout */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Existing Sections</h5>
                  {!schema.sections || schema.sections.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm bg-gray-50 rounded-lg">
                      No sections added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {schema.sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0">
                            {/* Section Name and Description in a row for desktop */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 flex-1">
                              <div>
                                <h6 className="font-medium text-gray-800 text-sm sm:text-base">{section.name}</h6>
                                <p className="text-xs text-gray-500 mt-1">ID: {section.id}</p>
                              </div>
                              <div>
                                {section.description && (
                                  <p className="text-xs sm:text-sm text-gray-600">{section.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">{section.fields.length} field(s)</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm self-start lg:self-center transition-colors lg:ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Field Builder */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700">Add Test Field</h4>
              <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                {useSections && schema.sections && schema.sections.length > 0 && (
                  <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                      Section
                    </label>
                    <select
                      value={currentField.sectionId}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, sectionId: e.target.value }))}
                      className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                    >
                      <option value="">Choose a section</option>
                      {schema.sections.map((section, index) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Redesigned layout: Field Name and Type in first row, Required and Unit in second row */}
                <div className="space-y-3">
                  {/* First Row: Field Name and Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Field Name"
                      name="fieldLabel"
                      value={currentField.label}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, label: e.target.value }))}
                    />

                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Type
                      </label>
                      <select
                        value={currentField.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setCurrentField((prev) => ({
                            ...prev,
                            type: newType,
                            // Reset standard range when switching to non-number type
                            standardRange: newType === "number" ? prev.standardRange : null,
                          }));
                        }}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row: Required and Unit */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Changed Required from checkbox to Yes/No select */}
                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Required
                      </label>
                      <select
                        value={currentField.required}
                        onChange={(e) => setCurrentField((prev) => ({ ...prev, required: e.target.value }))}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Unit
                      </label>
                      <select
                        value={currentField.unit}
                        onChange={(e) => setCurrentField((prev) => ({ ...prev, unit: e.target.value }))}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        {commonUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit || "No Unit"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Field Options for Radio/Select/Checkbox */}
                {["radio", "select", "checkbox"].includes(currentField.type) && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Options
                      </label>
                      <div className="flex-1 p-3">
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                          {currentField.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-700 break-words flex-1">{option}</span>
                              <button
                                type="button"
                                onClick={() => removeFieldOption(index)}
                                className="text-red-600 hover:text-red-800 text-lg font-bold flex-shrink-0 ml-2 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <InputField
                            label="Option"
                            name="newOption"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addFieldOption()}
                          />
                          <button
                            type="button"
                            onClick={addFieldOption}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Field Standard Range Values Section - Only show for number fields */}
                {currentField.type === "number" && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row border-b border-gray-300">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Standard Range
                      </label>
                      <div className="flex-1 p-3 space-y-4">
                        <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                          <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                            Type
                          </label>
                          <select
                            value={currentField.standardRange?.type || "none"}
                            onChange={(e) => {
                              if (e.target.value === "none") {
                                setCurrentField((prev) => ({ ...prev, standardRange: null }));
                              } else {
                                initializeStandardRange(e.target.value);
                              }
                            }}
                            className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                          >
                            {standardRangeTypes.map((ref) => (
                              <option key={ref.value} value={ref.value}>
                                {ref.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Gender Based Standard Range */}
                        {currentField.standardRange?.type === "genderBased" && (
                          <div className="space-y-3">
                            {genderOptions.map((gender) => (
                              <div key={gender.value} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 capitalize block">
                                  {gender.label}:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <InputField
                                    label="Min value"
                                    name={`${gender.value}Min`}
                                    type="number"
                                    value={currentField.standardRange?.ranges?.[gender.value]?.min || ""}
                                    onChange={(e) =>
                                      handleStandardRangeChange(`ranges.${gender.value}.min`, e.target.value)
                                    }
                                  />
                                  <InputField
                                    label="Max value"
                                    name={`${gender.value}Max`}
                                    type="number"
                                    value={currentField.standardRange?.ranges?.[gender.value]?.max || ""}
                                    onChange={(e) =>
                                      handleStandardRangeChange(`ranges.${gender.value}.max`, e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Age Based Standard Range - Improved design */}
                        {currentField.standardRange?.type === "ageBased" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-sm font-semibold text-gray-700">Age Ranges</h5>
                              <button
                                type="button"
                                onClick={addAgeRange}
                                disabled={isAddingRange}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                              >
                                {isAddingRange ? "Adding..." : "Add Age Range"}
                              </button>
                            </div>
                            <div className="space-y-4">
                              {currentField.standardRange?.ranges?.map((range, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700">Age Range {index + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeAgeRange(index)}
                                      className="text-red-600 hover:text-red-800 text-lg font-bold"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <InputField
                                        label="Min Age"
                                        type="number"
                                        value={range.ageMin || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "ageMin", e.target.value)}
                                      />
                                      <InputField
                                        label="Max Age"
                                        type="number"
                                        value={range.ageMax || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "ageMax", e.target.value)}
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <InputField
                                        label="Min Value"
                                        type="number"
                                        value={range.min || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "min", e.target.value)}
                                      />
                                      <InputField
                                        label="Max Value"
                                        type="number"
                                        value={range.max || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "max", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(!currentField.standardRange?.ranges ||
                                currentField.standardRange.ranges.length === 0) && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  No age ranges added yet. Click "Add Age Range" to create one.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Gender and Age Based Standard Range - Improved design */}
                        {currentField.standardRange?.type === "genderWithAgeBased" && (
                          <div className="space-y-6">
                            {genderOptions.map((gender) => (
                              <div key={gender.value} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                  <h5 className="text-sm font-semibold text-gray-700 capitalize">
                                    {gender.label} Ranges
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() => addGenderAgeRange(gender.value)}
                                    disabled={isAddingRange}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                  >
                                    {isAddingRange ? "Adding..." : "Add Age Range"}
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  {currentField.standardRange?.ranges[gender.value]?.map((range, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-gray-700">Age Range {index + 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeGenderAgeRange(gender.value, index)}
                                          className="text-red-600 hover:text-red-800 text-lg font-bold"
                                        >
                                          ×
                                        </button>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <InputField
                                            label="Min Age"
                                            type="number"
                                            value={range.ageMin || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "ageMin", e.target.value)
                                            }
                                          />
                                          <InputField
                                            label="Max Age"
                                            type="number"
                                            value={range.ageMax || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "ageMax", e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <InputField
                                            label="Min Value"
                                            type="number"
                                            value={range.min || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "min", e.target.value)
                                            }
                                          />
                                          <InputField
                                            label="Max Value"
                                            type="number"
                                            value={range.max || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "max", e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!currentField.standardRange?.ranges[gender.value] ||
                                    currentField.standardRange.ranges[gender.value].length === 0) && (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                      No age ranges added for {gender.label}. Click "Add Age Range" to create one.
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Number Range Only */}
                        {currentField.standardRange?.type === "numberRange" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField
                              label="Min value"
                              name="rangeMin"
                              type="number"
                              value={currentField.standardRange?.min || ""}
                              onChange={(e) => handleStandardRangeChange("min", e.target.value)}
                            />
                            <InputField
                              label="Max value"
                              name="rangeMax"
                              type="number"
                              value={currentField.standardRange?.max || ""}
                              onChange={(e) => handleStandardRangeChange("max", e.target.value)}
                            />
                          </div>
                        )}

                        {/* Textarea Standard Range */}
                        {currentField.standardRange?.type === "text" && (
                          <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                            <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                              Standard Range Text
                            </label>
                            <textarea
                              value={currentField.standardRange.value || ""}
                              onChange={(e) => handleStandardRangeChange("value", e.target.value)}
                              rows={3}
                              className="flex-1 px-3 py-2 focus:outline-none resize-none text-sm bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={addField}
                  disabled={useSections && !currentField.sectionId}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Field {useSections ? "to Section" : "to Test"}
                </button>
              </div>
            </div>

            {/* Import/Export */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={exportSchema}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm sm:text-base transition-colors"
              >
                Export Test Schema
              </button>
              <label className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-center cursor-pointer text-sm sm:text-base transition-colors">
                Import Test Schema
                <input type="file" accept=".json" onChange={importSchema} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Form Preview Section */}
        <FormPreview
          schema={schema}
          useSections={useSections}
          useStandardRange={useStandardRange}
          testStandardRange={testStandardRange}
          removeField={removeField}
          getFieldsCount={getFieldsCount}
        />

        {/* Schema Display Section */}
        <SchemaDisplay
          schema={schema}
          useSections={useSections}
          useStandardRange={useStandardRange}
          testStandardRange={testStandardRange}
        />
      </div>
    </div>
  );
};

export default SchemaBuilderForLabTest;
