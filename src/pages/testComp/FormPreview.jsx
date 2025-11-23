import React, { useState, useEffect, useCallback } from "react";

const FormPreview = ({ schema, useSections, useStandardRange, testStandardRange, removeField, getFieldsCount }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [validationStates, setValidationStates] = useState({});
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  const getAgeGroup = (age) => {
    const ageNum = parseFloat(age);
    if (isNaN(ageNum)) return null;

    if (ageNum <= 2) return "infant";
    if (ageNum <= 12) return "child";
    if (ageNum <= 64) return "adult";
    return "old";
  };

  const getStandardRangeText = useCallback(
    (field) => {
      if (!field.standardRange) return null;

      const { type, ranges, min, max } = field.standardRange;

      if (type === "range" && min && max) {
        return `Standard range: ${min} - ${max}`;
      }

      if (type === "age" && ranges && patientAge) {
        const ageGroup = getAgeGroup(patientAge);
        if (ageGroup && ranges[ageGroup]) {
          const range = ranges[ageGroup];
          const hasMin = range.min && range.min !== "";
          const hasMax = range.max && range.max !== "";

          if (hasMin && hasMax) {
            return `Standard range for ${ageGroup} (age ${patientAge}): ${range.min} - ${range.max}`;
          } else if (hasMin) {
            return `Standard range for ${ageGroup} (age ${patientAge}): ≥ ${range.min}`;
          } else if (hasMax) {
            return `Standard range for ${ageGroup} (age ${patientAge}): ≤ ${range.max}`;
          }
        }
      }

      if (type === "gender" && ranges && patientGender) {
        if (ranges[patientGender]) {
          const range = ranges[patientGender];
          const hasMin = range.min && range.min !== "";
          const hasMax = range.max && range.max !== "";

          if (hasMin && hasMax) {
            return `Standard range for ${patientGender}: ${range.min} - ${range.max}`;
          } else if (hasMin) {
            return `Standard range for ${patientGender}: ≥ ${range.min}`;
          } else if (hasMax) {
            return `Standard range for ${patientGender}: ≤ ${range.max}`;
          }
        }
      }

      return null;
    },
    [patientAge, patientGender]
  );

  const validateField = useCallback(
    (field, value) => {
      if (field.required) {
        if (field.type === "checkbox") {
          // For checkbox, check if at least one option is selected
          if (!value || value.length === 0) {
            return { type: "error", message: "This field is required" };
          }
        } else if (!value || value.toString().trim() === "") {
          return { type: "error", message: "This field is required" };
        }
      }

      if (field.type === "number" && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return { type: "error", message: "Please enter a valid number" };
        }

        // Validate against standard range if available
        if (field.standardRange) {
          const { type, ranges, min, max } = field.standardRange;

          if (type === "range" && min !== undefined && max !== undefined) {
            if (numValue < parseFloat(min)) {
              const rangeText = `Standard range: ${min} - ${max}`;
              return { type: "below", message: `Value is below standard range (${rangeText})` };
            }
            if (numValue > parseFloat(max)) {
              const rangeText = `Standard range: ${min} - ${max}`;
              return { type: "above", message: `Value is above standard range (${rangeText})` };
            }
            if (numValue >= parseFloat(min) && numValue <= parseFloat(max)) {
              const rangeText = `Standard range: ${min} - ${max}`;
              return { type: "within", message: `Value is within standard range (${rangeText})` };
            }
          }

          // Validate age-based ranges using patient age
          if (type === "age" && ranges && patientAge) {
            const ageGroup = getAgeGroup(patientAge);
            if (ageGroup && ranges[ageGroup]) {
              const range = ranges[ageGroup];
              const hasMin = range.min !== undefined && range.min !== "";
              const hasMax = range.max !== undefined && range.max !== "";

              if (hasMin && numValue < parseFloat(range.min)) {
                const rangeText = getStandardRangeText(field);
                return { type: "below", message: `Value is below standard range (${rangeText})` };
              }
              if (hasMax && numValue > parseFloat(range.max)) {
                const rangeText = getStandardRangeText(field);
                return { type: "above", message: `Value is above standard range (${rangeText})` };
              }
              if ((!hasMin || numValue >= parseFloat(range.min)) && (!hasMax || numValue <= parseFloat(range.max))) {
                const rangeText = getStandardRangeText(field);
                return { type: "within", message: `Value is within standard range (${rangeText})` };
              }
            }
          }

          // Validate gender-based ranges using patient gender
          if (type === "gender" && ranges && patientGender) {
            if (ranges[patientGender]) {
              const range = ranges[patientGender];
              const hasMin = range.min !== undefined && range.min !== "";
              const hasMax = range.max !== undefined && range.max !== "";

              if (hasMin && numValue < parseFloat(range.min)) {
                const rangeText = getStandardRangeText(field);
                return { type: "below", message: `Value is below standard range (${rangeText})` };
              }
              if (hasMax && numValue > parseFloat(range.max)) {
                const rangeText = getStandardRangeText(field);
                return { type: "above", message: `Value is above standard range (${rangeText})` };
              }
              if ((!hasMin || numValue >= parseFloat(range.min)) && (!hasMax || numValue <= parseFloat(range.max))) {
                const rangeText = getStandardRangeText(field);
                return { type: "within", message: `Value is within standard range (${rangeText})` };
              }
            }
          }
        }
      }

      return null;
    },
    [patientAge, patientGender, getStandardRangeText]
  );

  // Re-validate all fields when patient age or gender changes
  const revalidateAllFields = useCallback(() => {
    const newErrors = {};
    const newValidationStates = {};
    let allFields = [];

    if (!schema) return;

    if (useSections && schema.sections) {
      schema.sections.forEach((section) => {
        allFields = [...allFields, ...(section.fields || [])];
      });
    } else {
      allFields = schema.fields || [];
    }

    allFields.forEach((field) => {
      const value = formData[field.id];
      const validation = validateField(field, value);
      if (validation) {
        newErrors[field.id] = validation;
        newValidationStates[field.id] = validation.type;
      } else {
        // Clear validation state if no validation result
        newValidationStates[field.id] = null;
      }
    });

    setErrors(newErrors);
    setValidationStates(newValidationStates);
  }, [schema, useSections, formData, validateField]);

  // Effect to re-validate all fields when patient age or gender changes
  useEffect(() => {
    revalidateAllFields();
  }, [patientAge, patientGender, revalidateAllFields]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Validate the field immediately
    const field = findFieldById(fieldId);
    if (field) {
      const validation = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [fieldId]: validation,
      }));
      setValidationStates((prev) => ({
        ...prev,
        [fieldId]: validation ? validation.type : null,
      }));
    }
  };

  // Handle checkbox selection for multiple options
  const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
    const currentValues = formData[fieldId] || [];
    let newValues;

    if (isChecked) {
      // Add the option to selected values
      newValues = [...currentValues, optionValue];
    } else {
      // Remove the option from selected values
      newValues = currentValues.filter(value => value !== optionValue);
    }

    handleInputChange(fieldId, newValues);
  };

  const findFieldById = (fieldId) => {
    let allFields = [];

    if (!schema) return null;

    if (useSections && schema.sections) {
      schema.sections.forEach((section) => {
        allFields = [...allFields, ...(section.fields || [])];
      });
    } else {
      allFields = schema.fields || [];
    }

    return allFields.find((field) => field.id === fieldId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const newValidationStates = {};
    let allFields = [];

    if (!schema) {
      setErrors({});
      setValidationStates({});
      return;
    }

    if (useSections && schema.sections) {
      schema.sections.forEach((section) => {
        allFields = [...allFields, ...(section.fields || [])];
      });
    } else {
      allFields = schema.fields || [];
    }

    allFields.forEach((field) => {
      const validation = validateField(field, formData[field.id]);
      if (validation) {
        newErrors[field.id] = validation;
        newValidationStates[field.id] = validation.type;
      }
    });

    setErrors(newErrors);
    setValidationStates(newValidationStates);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully:", {
        patientAge,
        patientGender,
        ...formData,
      });
      alert("Form submitted successfully! Check console for data.");
    }
  };

  const renderInputField = (field) => {
    const value = formData[field.id] || "";
    const validation = errors[field.id];
    const validationState = validationStates[field.id];

    const getLabelText = () => {
      return (
        <>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </>
      );
    };

    // Dynamic styling based on validation state
    const getInputStyles = () => {
      switch (validationState) {
        case "within":
          return {
            container: "border-green-500 bg-green-50",
            input: "text-green-700 bg-green-50",
            unit: "text-green-700 border-green-300 bg-green-100",
            label: "border-green-300 bg-green-100 text-green-800",
          };
        case "below":
        case "above":
          return {
            container: "border-red-500 bg-red-50",
            input: "text-red-700 bg-red-50",
            unit: "text-red-700 border-red-300 bg-red-100",
            label: "border-red-300 bg-red-100 text-red-800",
          };
        case "error":
          return {
            container: "border-red-500 bg-red-50",
            input: "text-red-700 bg-red-50",
            unit: "text-red-700 border-red-300 bg-red-100",
            label: "border-red-300 bg-red-100 text-red-800",
          };
        default:
          return {
            container: "border-gray-300 bg-white",
            input: "text-gray-900 bg-white",
            unit: "text-gray-500 border-gray-300 bg-gray-50",
            label: "border-gray-300 bg-gray-50 text-gray-700",
          };
      }
    };

    const getMessageStyles = () => {
      switch (validationState) {
        case "within":
          return "text-green-800 bg-green-50 border-green-200";
        case "below":
        case "above":
          return "text-red-800 bg-red-50 border-red-200";
        case "error":
          return "text-red-800 bg-red-50 border-red-200";
        default:
          return "text-blue-800 bg-blue-50 border-blue-200";
      }
    };

    const getMessageIcon = () => {
      switch (validationState) {
        case "within":
          return "✅";
        case "below":
        case "above":
          return "⚠️";
        case "error":
          return "❌";
        default:
          return "ℹ️";
      }
    };

    const styles = getInputStyles();

    // Get standard range text for display (always show when available)
    const standardRangeText = getStandardRangeText(field);

    switch (field.type) {
      case "text":
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                required={field.required}
              />
              {field.unit && (
                <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
              )}
            </div>
          </div>
        );

      case "textarea":
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 flex flex-col">
              <textarea
                rows={3}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm resize-none border-0 ${styles.input}`}
                required={field.required}
              />
              {field.unit && <div className={`px-3 py-2 text-sm border-t ${styles.unit}`}>Unit: {field.unit}</div>}
            </div>
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
              <label
                className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
              >
                {getLabelText()}
              </label>
              <div className="flex-1 flex items-center">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  step="any"
                  className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                  required={field.required}
                />
                {field.unit && (
                  <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
                )}
              </div>
            </div>

            {/* Always show standard range info when available */}
            {standardRangeText && !value && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {standardRangeText}
                </div>
              </div>
            )}

            {/* Show validation message when value is entered */}
            {validation && value && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 flex items-center">
              <select
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {field.unit && (
                <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
              )}
            </div>
          </div>
        );

      case "radio":
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 px-3 py-2 sm:py-3">
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={value === option}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {field.unit && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-500">Unit: {field.unit}</div>
              )}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 px-3 py-2 sm:py-3">
              <div className="space-y-2">
                {field.options?.map((option, index) => {
                  const isChecked = Array.isArray(value) && value.includes(option);
                  return (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  );
                })}
              </div>
              {field.unit && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-500">Unit: {field.unit}</div>
              )}
              {Array.isArray(value) && value.length > 0 && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {value.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
            <label
              className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
            >
              {getLabelText()}
            </label>
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                required={field.required}
              />
              {field.unit && (
                <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
              )}
            </div>
          </div>
        );
    }
  };

  const renderTestStandardRange = () => {
    if (!useStandardRange || !testStandardRange) return null;

    const { type, options, text } = testStandardRange;

    if (type === "options" && options && options.length > 0) {
      return (
        <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">Test Standard Range</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-blue-700 font-medium">{option.key}:</span>
                <span className="text-blue-900">{option.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (type === "text" && text) {
      return (
        <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Test Standard Range</h4>
          <p className="text-sm text-blue-900">{text}</p>
        </div>
      );
    }

    return null;
  };

  const renderFormField = (field, sectionIndex = null, fieldIndex) => {
    if (!field || !field.id) return null;

    const validation = errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        {renderInputField(field)}

        {validation && validation.type === "error" && (
          <p className="text-sm p-2 rounded border text-red-800 bg-red-50 border-red-200">❌ {validation.message}</p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => removeField(sectionIndex, fieldIndex)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-red-50 border border-red-200"
          >
            Remove Field
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Form Preview</h3>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {getFieldsCount()} field(s) configured
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {renderTestStandardRange()}

        {/* Patient Information Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Patient Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age Input */}
            <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
              <label className="w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 text-gray-700 flex items-center">
                Patient Age
              </label>
              <div className="flex-1 flex items-center">
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm bg-white border-0"
                  placeholder="Enter age in years"
                  min="0"
                  max="120"
                />
                <span className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap border-l border-gray-300 bg-gray-50">
                  years
                </span>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
              <label className="w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 text-gray-700 flex items-center">
                Patient Gender
              </label>
              <div className="flex-1 flex items-center">
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm bg-white border-0"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          {(patientAge || patientGender) && (
            <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Current Selection:</strong>
                {patientAge && ` Age: ${patientAge} years (${getAgeGroup(patientAge) || "Unknown age group"})`}
                {patientGender && ` Gender: ${patientGender}`}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {useSections && schema?.sections
              ? schema.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800">{section.name}</h4>
                      {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
                    </div>
                    <div className="space-y-4">
                      {(section.fields || []).map((field, fieldIndex) =>
                        renderFormField(field, sectionIndex, fieldIndex)
                      )}
                    </div>
                  </div>
                ))
              : (schema?.fields || []).map((field, fieldIndex) => renderFormField(field, null, fieldIndex))}
          </div>

          {getFieldsCount() === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No fields added yet. Add fields to see the preview.
            </div>
          ) : (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({});
                  setErrors({});
                  setValidationStates({});
                  setPatientAge("");
                  setPatientGender("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Form
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormPreview;