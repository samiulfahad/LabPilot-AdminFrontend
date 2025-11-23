import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import SchemaDisplay from "./SchemaDisplay";
import FormPreview from "./FormPreview";

const SchemaBuilder = () => {
  const [schema, setSchema] = useState({
    testName: "",
    testDescription: "",
    fields: [],
  });

  const [useSections, setUseSections] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    id: "",
    name: "",
    description: "",
  });

  const [currentField, setCurrentField] = useState({
    id: "",
    label: "",
    type: "text",
    required: false,
    unit: "",
    reference: null,
    options: [],
    sectionId: "",
  });

  const [newOption, setNewOption] = useState("");
  const [newReferenceOption, setNewReferenceOption] = useState("");

  const fieldTypes = ["text", "number", "textarea", "select", "radio", "checkbox", "date", "datetime-local"];

  const referenceTypes = [
    { value: "none", label: "No Reference" },
    { value: "range", label: "Numerical Range" },
    { value: "options", label: "Fixed Options" },
    { value: "text", label: "Text Reference" },
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

  // Update reference based on field type
  useEffect(() => {
    if (["radio", "select"].includes(currentField.type) && currentField.reference?.type !== "options") {
      setCurrentField((prev) => ({
        ...prev,
        reference: {
          type: "options",
          value: "",
          min: "",
          max: "",
          options: [],
        },
      }));
    }
  }, [currentField.type]);

  const addSection = () => {
    if (!currentSection.name.trim()) {
      alert("Section name is required");
      return;
    }

    const sectionId = currentSection.id || currentSection.name.toLowerCase().replace(/\s+/g, "_");

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

    // Reset current section
    setCurrentSection({
      id: "",
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

  const addField = () => {
    if (!currentField.label.trim()) {
      alert("Field label is required");
      return;
    }

    // Validate radio/select fields have options
    if (["radio", "select"].includes(currentField.type) && currentField.options.length === 0) {
      alert(
        `${currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)} fields must have at least one option`
      );
      return;
    }

    const fieldId = currentField.id || currentField.label.toLowerCase().replace(/\s+/g, "_");

    // Create field data
    const fieldData = {
      id: fieldId,
      label: currentField.label,
      type: currentField.type,
      required: currentField.required,
      options: currentField.options.length > 0 ? [...currentField.options] : undefined,
    };

    // Only include unit if provided and not empty
    if (currentField.unit && currentField.unit.trim()) {
      fieldData.unit = currentField.unit;
    }

    // Only include reference if it exists and is not 'none'
    if (currentField.reference && currentField.reference.type !== "none") {
      const referenceData = { ...currentField.reference };
      // Remove empty values
      Object.keys(referenceData).forEach((key) => {
        if (referenceData[key] === "" || (Array.isArray(referenceData[key]) && referenceData[key].length === 0)) {
          delete referenceData[key];
        }
      });
      if (Object.keys(referenceData).length > 0) {
        fieldData.reference = referenceData;
      }
    }

    if (useSections && currentField.sectionId) {
      // Add field to the selected section
      setSchema((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === currentField.sectionId ? { ...section, fields: [...section.fields, fieldData] } : section
        ),
      }));
    } else {
      // Add field directly to form
      setSchema((prev) => ({
        ...prev,
        fields: [...prev.fields, fieldData],
      }));
    }

    // Reset current field
    setCurrentField({
      id: "",
      label: "",
      type: "text",
      required: false,
      unit: "",
      reference: null,
      options: [],
      sectionId: useSections ? currentField.sectionId : "",
    });
    setNewOption("");
    setNewReferenceOption("");
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

  const handleReferenceChange = (key, value) => {
    setCurrentField((prev) => ({
      ...prev,
      reference: {
        ...prev.reference,
        [key]: value,
      },
    }));
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

  const addReferenceOption = () => {
    if (!newReferenceOption.trim()) return;

    setCurrentField((prev) => ({
      ...prev,
      reference: {
        ...prev.reference,
        options: [...(prev.reference?.options || []), newReferenceOption.trim()],
      },
    }));
    setNewReferenceOption("");
  };

  const removeReferenceOption = (index) => {
    setCurrentField((prev) => ({
      ...prev,
      reference: {
        ...prev.reference,
        options: (prev.reference?.options || []).filter((_, i) => i !== index),
      },
    }));
  };

  const exportSchema = () => {
    // Clean up schema before export
    const cleanedSchema = {
      ...schema,
      fields: schema.fields
        ? schema.fields.map((field) => {
            const cleanedField = { ...field };
            if (cleanedField.reference?.type === "none") {
              delete cleanedField.reference;
            }
            // Remove unit if empty
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
              if (cleanedField.reference?.type === "none") {
                delete cleanedField.reference;
              }
              // Remove unit if empty
              if (!cleanedField.unit || cleanedField.unit === "") {
                delete cleanedField.unit;
              }
              return cleanedField;
            }),
          }))
        : undefined,
    };

    // Remove sections if not using sections
    if (!useSections) {
      delete cleanedSchema.sections;
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
        // Detect if schema uses sections
        if (importedSchema.sections && importedSchema.sections.length > 0) {
          setUseSections(true);
        }
        setSchema(importedSchema);
      } catch (error) {
        alert("Invalid schema file");
      }
    };
    reader.readAsText(file);
  };

  const initializeReference = (type) => {
    if (!currentField.reference) {
      setCurrentField((prev) => ({
        ...prev,
        reference: {
          type: type,
          value: "",
          min: "",
          max: "",
          options: [],
        },
      }));
    } else {
      handleReferenceChange("type", type);
    }
  };

  const getFieldsCount = () => {
    if (useSections && schema.sections) {
      return schema.sections.reduce((total, section) => total + section.fields.length, 0);
    }
    return schema.fields.length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Lab Report Test Builder</h2>

        {/* Schema Builder Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Schema Builder</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Test Configuration */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Test Configuration</h4>
              <div className="space-y-4">
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

            {/* Sections Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
              <div>
                <h4 className="text-md font-semibold text-gray-700">Test Sections</h4>
                <p className="text-sm text-gray-600">Organize test parameters into sections (optional)</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={useSections}
                    onChange={(e) => setUseSections(e.target.checked)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${useSections ? "bg-blue-600" : "bg-gray-300"}`}></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      useSections ? "transform translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {useSections ? "Sections Enabled" : "Sections Disabled"}
                </div>
              </label>
            </div>

            {/* Section Builder */}
            {useSections && (
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">Manage Test Sections</h4>
                <div className="space-y-4 p-4 border border-gray-300 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Section Name"
                      name="sectionName"
                      value={currentSection.name}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <InputField
                      label="Section ID"
                      name="sectionId"
                      value={currentSection.id}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, id: e.target.value }))}
                    />
                  </div>
                  <InputField
                    label="Description"
                    name="sectionDescription"
                    value={currentSection.description}
                    onChange={(e) => setCurrentSection((prev) => ({ ...prev, description: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  >
                    Add Section
                  </button>
                </div>

                {/* Existing Sections */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Existing Sections</h5>
                  {!schema.sections || schema.sections.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No sections added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {schema.sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h6 className="font-medium text-gray-800">{section.name}</h6>
                              {section.description && (
                                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">{section.fields.length} parameter(s)</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Remove Section
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
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Add Test Parameter</h4>
              <div className="space-y-4 p-4 border border-gray-300 rounded-lg">
                {useSections && schema.sections && schema.sections.length > 0 && (
                  <div className="flex border border-gray-300 rounded-lg">
                    <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                      Section
                    </label>
                    <select
                      value={currentField.sectionId}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, sectionId: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Parameter Name"
                    name="fieldLabel"
                    value={currentField.label}
                    onChange={(e) => setCurrentField((prev) => ({ ...prev, label: e.target.value }))}
                  />
                  <InputField
                    label="Parameter ID"
                    name="fieldId"
                    value={currentField.id}
                    onChange={(e) => setCurrentField((prev) => ({ ...prev, id: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex border border-gray-300 rounded-lg">
                    <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                      Field Type
                    </label>
                    <select
                      value={currentField.type}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, type: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex border border-gray-300 rounded-lg">
                    <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                      Unit
                    </label>
                    <select
                      value={currentField.unit}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, unit: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
                    >
                      {commonUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit || "No Unit"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field Options for Radio/Select */}
                {["radio", "select"].includes(currentField.type) && (
                  <div className="border border-gray-300 rounded-lg">
                    <div className="flex border-b border-gray-300">
                      <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-tl-lg flex items-center">
                        Options
                      </label>
                      <div className="flex-1 px-3 py-2 rounded-tr-lg">
                        <div className="space-y-2 mb-3">
                          {currentField.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-700">{option}</span>
                              <button
                                type="button"
                                onClick={() => removeFieldOption(index)}
                                className="text-red-600 hover:text-red-800 text-lg font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addFieldOption()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={addFieldOption}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex border border-gray-300 rounded-lg">
                  <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                    Required
                  </label>
                  <div className="flex-1 px-3 py-2 rounded-r-lg flex items-center">
                    <input
                      type="checkbox"
                      id="required-field"
                      checked={currentField.required}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, required: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="required-field" className="ml-2 block text-sm text-gray-700">
                      Required Parameter
                    </label>
                  </div>
                </div>

                {/* Reference Values Section */}
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex border-b border-gray-300">
                    <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-tl-lg flex items-center">
                      Reference
                    </label>
                    <div className="flex-1 px-3 py-2 rounded-tr-lg space-y-4">
                      <div className="flex border border-gray-300 rounded-lg">
                        <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                          Type
                        </label>
                        <select
                          value={currentField.reference?.type || "none"}
                          onChange={(e) => {
                            if (e.target.value === "none") {
                              setCurrentField((prev) => ({ ...prev, reference: null }));
                            } else {
                              initializeReference(e.target.value);
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
                        >
                          {referenceTypes.map((ref) => (
                            <option key={ref.value} value={ref.value}>
                              {ref.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {currentField.reference?.type === "range" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Min Value"
                            name="minValue"
                            type="number"
                            value={currentField.reference.min}
                            onChange={(e) => handleReferenceChange("min", e.target.value)}
                          />
                          <InputField
                            label="Max Value"
                            name="maxValue"
                            type="number"
                            value={currentField.reference.max}
                            onChange={(e) => handleReferenceChange("max", e.target.value)}
                          />
                        </div>
                      )}

                      {currentField.reference?.type === "options" && (
                        <div className="space-y-2">
                          <div className="space-y-2 mb-3">
                            {currentField.reference.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                              >
                                <span className="text-sm text-gray-700">{option}</span>
                                <button
                                  type="button"
                                  onClick={() => removeReferenceOption(index)}
                                  className="text-red-600 hover:text-red-800 text-lg font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newReferenceOption}
                              onChange={(e) => setNewReferenceOption(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addReferenceOption()}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={addReferenceOption}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {currentField.reference?.type === "text" && (
                        <div className="flex border border-gray-300 rounded-lg">
                          <label className="w-32 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
                            Reference Text
                          </label>
                          <textarea
                            value={currentField.reference.value}
                            onChange={(e) => handleReferenceChange("value", e.target.value)}
                            rows={3}
                            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addField}
                  disabled={useSections && !currentField.sectionId}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Parameter {useSections ? "to Section" : "to Test"}
                </button>
              </div>
            </div>

            {/* Import/Export */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={exportSchema}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                Export Test Schema
              </button>
              <label className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-center cursor-pointer">
                Import Test Schema
                <input type="file" accept=".json" onChange={importSchema} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Schema Display Section */}
        <SchemaDisplay schema={schema} useSections={useSections} />

        {/* Form Preview Section */}
        <FormPreview
          schema={schema}
          useSections={useSections}
          removeField={removeField}
          getFieldsCount={getFieldsCount}
        />
      </div>
    </div>
  );
};

export default SchemaBuilder;
