import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import SelectField from "../../components/html/SelectField";
import Popup from "../../components/popup/Popup";
import schemaService from "../../services/schemaService";
import LoadingScreen from "../../components/loadingPage";

const SchemaRenderer = ({ useSections = true, useStandardRange = true, onSubmit, onClear, showPatientInfo = true }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [validationStates, setValidationStates] = useState({});
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({});

  const { schemaId } = useParams();

  console.log(schemaId);

  // Generate a unique key for each field
  const generateFieldKey = (field, sectionIndex = null, fieldIndex) => {
    if (sectionIndex !== null) {
      return `section-${sectionIndex}-field-${fieldIndex}`;
    }
    return `field-${fieldIndex}`;
  };

  const getStandardRangeText = useCallback(
    (field) => {
      if (!field.standardRange || !useStandardRange) return null;

      const { type, ranges, min, max } = field.standardRange;

      if (type === "numberRange" && min && max) {
        return `Standard range: ${min} - ${max}`;
      }

      if (type === "ageBased" && ranges && patientAge) {
        const ageNum = parseFloat(patientAge);
        if (!isNaN(ageNum)) {
          const matchingRange = ranges.find((range) => {
            const minAge = range.ageMin ? parseFloat(range.ageMin) : -Infinity;
            const maxAge = range.ageMax ? parseFloat(range.ageMax) : Infinity;
            return ageNum >= minAge && ageNum <= maxAge;
          });

          if (matchingRange) {
            const hasMin = matchingRange.min && matchingRange.min !== "";
            const hasMax = matchingRange.max && matchingRange.max !== "";

            const ageRangeText = matchingRange.ageMax
              ? `age ${matchingRange.ageMin}-${matchingRange.ageMax}`
              : `age ${matchingRange.ageMin}+`;

            if (hasMin && hasMax) {
              return `Standard range (${ageRangeText}): ${matchingRange.min} - ${matchingRange.max}`;
            } else if (hasMin) {
              return `Standard range (${ageRangeText}): ≥ ${matchingRange.min}`;
            } else if (hasMax) {
              return `Standard range (${ageRangeText}): ≤ ${matchingRange.max}`;
            }
          }
        }
      }

      if (type === "genderBased" && ranges && patientGender) {
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

      if (type === "genderWithAgeBased" && ranges && patientGender && patientAge) {
        const genderRanges = ranges[patientGender];
        if (genderRanges && genderRanges.length > 0) {
          const ageNum = parseFloat(patientAge);
          if (!isNaN(ageNum)) {
            const matchingRange = genderRanges.find((range) => {
              const minAge = range.ageMin ? parseFloat(range.ageMin) : -Infinity;
              const maxAge = range.ageMax ? parseFloat(range.ageMax) : Infinity;
              return ageNum >= minAge && ageNum <= maxAge;
            });

            if (matchingRange) {
              const hasMin = matchingRange.min && matchingRange.min !== "";
              const hasMax = matchingRange.max && matchingRange.max !== "";

              const ageRangeText = matchingRange.ageMax
                ? `age ${matchingRange.ageMin}-${matchingRange.ageMax}`
                : `age ${matchingRange.ageMin}+`;

              if (hasMin && hasMax) {
                return `Standard range for ${patientGender} (${ageRangeText}): ${matchingRange.min} - ${matchingRange.max}`;
              } else if (hasMin) {
                return `Standard range for ${patientGender} (${ageRangeText}): ≥ ${matchingRange.min}`;
              } else if (hasMax) {
                return `Standard range for ${patientGender} (${ageRangeText}): ≤ ${matchingRange.max}`;
              }
            }
          }
        }
      }

      return null;
    },
    [patientAge, patientGender, useStandardRange]
  );

  const validateField = useCallback(
    (field, value) => {
      if (field.required) {
        if (field.type === "checkbox") {
          if (!value || value.length === 0) {
            return { type: "error", message: "This field is required" };
          }
        } else if (!value || value.toString().trim() === "") {
          return { type: "error", message: "This field is required" };
        }
      }

      if (field.type === "number" && value && useStandardRange && field.standardRange) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return { type: "error", message: "Please enter a valid number" };
        }

        const { type, ranges, min, max } = field.standardRange;

        if (type === "numberRange" && min !== undefined && max !== undefined) {
          if (numValue < parseFloat(min)) {
            const rangeText = `Standard range: ${min} - ${max}`;
            return { type: "outOfRange", message: `Value is below standard range (${rangeText})` };
          }
          if (numValue > parseFloat(max)) {
            const rangeText = `Standard range: ${min} - ${max}`;
            return { type: "outOfRange", message: `Value is above standard range (${rangeText})` };
          }
          if (numValue >= parseFloat(min) && numValue <= parseFloat(max)) {
            const rangeText = `Standard range: ${min} - ${max}`;
            return { type: "within", message: `Value is within standard range (${rangeText})` };
          }
        }

        if (type === "ageBased" && ranges && patientAge) {
          const ageNum = parseFloat(patientAge);
          if (!isNaN(ageNum)) {
            const matchingRange = ranges.find((range) => {
              const minAge = range.ageMin ? parseFloat(range.ageMin) : -Infinity;
              const maxAge = range.ageMax ? parseFloat(range.ageMax) : Infinity;
              return ageNum >= minAge && ageNum <= maxAge;
            });

            if (matchingRange) {
              const hasMin = matchingRange.min !== undefined && matchingRange.min !== "";
              const hasMax = matchingRange.max !== undefined && matchingRange.max !== "";

              if (hasMin && numValue < parseFloat(matchingRange.min)) {
                const rangeText = getStandardRangeText(field);
                return { type: "outOfRange", message: `Value is below standard range (${rangeText})` };
              }
              if (hasMax && numValue > parseFloat(matchingRange.max)) {
                const rangeText = getStandardRangeText(field);
                return { type: "outOfRange", message: `Value is above standard range (${rangeText})` };
              }
              if (
                (!hasMin || numValue >= parseFloat(matchingRange.min)) &&
                (!hasMax || numValue <= parseFloat(matchingRange.max))
              ) {
                const rangeText = getStandardRangeText(field);
                return { type: "within", message: `Value is within standard range (${rangeText})` };
              }
            }
          }
        }

        if (type === "genderBased" && ranges && patientGender) {
          if (ranges[patientGender]) {
            const range = ranges[patientGender];
            const hasMin = range.min !== undefined && range.min !== "";
            const hasMax = range.max !== undefined && range.max !== "";

            if (hasMin && numValue < parseFloat(range.min)) {
              const rangeText = getStandardRangeText(field);
              return { type: "outOfRange", message: `Value is below standard range (${rangeText})` };
            }
            if (hasMax && numValue > parseFloat(range.max)) {
              const rangeText = getStandardRangeText(field);
              return { type: "outOfRange", message: `Value is above standard range (${rangeText})` };
            }
            if ((!hasMin || numValue >= parseFloat(range.min)) && (!hasMax || numValue <= parseFloat(range.max))) {
              const rangeText = getStandardRangeText(field);
              return { type: "within", message: `Value is within standard range (${rangeText})` };
            }
          }
        }

        if (type === "genderWithAgeBased" && ranges && patientGender && patientAge) {
          const genderRanges = ranges[patientGender];
          if (genderRanges && genderRanges.length > 0) {
            const ageNum = parseFloat(patientAge);
            if (!isNaN(ageNum)) {
              const matchingRange = genderRanges.find((range) => {
                const minAge = range.ageMin ? parseFloat(range.ageMin) : -Infinity;
                const maxAge = range.ageMax ? parseFloat(range.ageMax) : Infinity;
                return ageNum >= minAge && ageNum <= maxAge;
              });

              if (matchingRange) {
                const hasMin = matchingRange.min !== undefined && matchingRange.min !== "";
                const hasMax = matchingRange.max !== undefined && matchingRange.max !== "";

                if (hasMin && numValue < parseFloat(matchingRange.min)) {
                  const rangeText = getStandardRangeText(field);
                  return { type: "outOfRange", message: `Value is below standard range (${rangeText})` };
                }
                if (hasMax && numValue > parseFloat(matchingRange.max)) {
                  const rangeText = getStandardRangeText(field);
                  return { type: "outOfRange", message: `Value is above standard range (${rangeText})` };
                }
                if (
                  (!hasMin || numValue >= parseFloat(matchingRange.min)) &&
                  (!hasMax || numValue <= parseFloat(matchingRange.max))
                ) {
                  const rangeText = getStandardRangeText(field);
                  return { type: "within", message: `Value is within standard range (${rangeText})` };
                }
              }
            }
          }
        }
      }

      return null;
    },
    [patientAge, patientGender, getStandardRangeText, useStandardRange]
  );

  // Re-validate all fields when patient age or gender changes
  const revalidateAllFields = useCallback(() => {
    const newErrors = {};
    const newValidationStates = {};

    if (!schema) return;

    const validateFields = (fields, prefix = "") => {
      fields.forEach((field, index) => {
        const fieldKey = prefix ? `${prefix}-field-${index}` : `field-${index}`;
        const value = formData[fieldKey];
        const validation = validateField(field, value);
        if (validation) {
          newErrors[fieldKey] = validation;
          newValidationStates[fieldKey] = validation.type;
        } else {
          newValidationStates[fieldKey] = null;
        }
      });
    };

    if (useSections && schema.sections) {
      schema.sections.forEach((section, sectionIndex) => {
        validateFields(section.fields || [], `section-${sectionIndex}`);
      });
    } else {
      validateFields(schema.fields || []);
    }

    setErrors(newErrors);
    setValidationStates(newValidationStates);
  }, [schema, useSections, formData, validateField]);

  useEffect(() => {
    revalidateAllFields();
  }, [patientAge, patientGender, revalidateAllFields]);

  const fetchSchema = async () => {
    console.log("called fetchSchema");
    try {
      setLoading(true);
      const response = await schemaService.getById(schemaId);
      console.log(response.data);
      setSchema(response.data);
    } catch (e) {
      setPopup({ type: "error", message: "Could not get the form" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schemaId) {
      fetchSchema();
    }
  }, [schemaId]);

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [fieldKey]: true,
    }));

    // Find the field to validate
    let field = null;
    if (fieldKey.startsWith("section-")) {
      const [_, sectionIndex, __, fieldIndex] = fieldKey.split("-");
      if (schema && schema.sections && schema.sections[parseInt(sectionIndex)]) {
        field = schema.sections[parseInt(sectionIndex)].fields[parseInt(fieldIndex)];
      }
    } else if (fieldKey.startsWith("field-")) {
      const [_, fieldIndex] = fieldKey.split("-");
      if (schema && schema.fields) {
        field = schema.fields[parseInt(fieldIndex)];
      }
    }

    if (field) {
      const validation = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: validation,
      }));
      setValidationStates((prev) => ({
        ...prev,
        [fieldKey]: validation ? validation.type : null,
      }));
    }
  };

  const handleCheckboxChange = (fieldKey, optionValue, isChecked) => {
    const currentValues = formData[fieldKey] || [];
    let newValues;

    if (isChecked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((value) => value !== optionValue);
    }

    setTouchedFields((prev) => ({
      ...prev,
      [fieldKey]: true,
    }));

    handleInputChange(fieldKey, newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!schema) return;

    // Mark all fields as touched on submit
    const allTouched = {};

    const markFieldsTouched = (fields, prefix = "") => {
      fields.forEach((field, index) => {
        const fieldKey = prefix ? `${prefix}-field-${index}` : `field-${index}`;
        allTouched[fieldKey] = true;
      });
    };

    if (useSections && schema.sections) {
      schema.sections.forEach((section, sectionIndex) => {
        markFieldsTouched(section.fields || [], `section-${sectionIndex}`);
      });
    } else {
      markFieldsTouched(schema.fields || []);
    }

    setTouchedFields(allTouched);

    // Validate all fields
    const newErrors = {};
    const newValidationStates = {};

    const validateAllFields = (fields, prefix = "") => {
      fields.forEach((field, index) => {
        const fieldKey = prefix ? `${prefix}-field-${index}` : `field-${index}`;
        const validation = validateField(field, formData[fieldKey]);
        if (validation) {
          newErrors[fieldKey] = validation;
          newValidationStates[fieldKey] = validation.type;
        }
      });
    };

    if (useSections && schema.sections) {
      schema.sections.forEach((section, sectionIndex) => {
        validateAllFields(section.fields || [], `section-${sectionIndex}`);
      });
    } else {
      validateAllFields(schema.fields || []);
    }

    setErrors(newErrors);
    setValidationStates(newValidationStates);

    if (Object.keys(newErrors).length === 0) {
      const submissionData = {
        patientAge,
        patientGender,
        formData,
        testName: schema.testName,
        testDescription: schema.testDescription,
      };

      if (onSubmit) {
        onSubmit(submissionData);
      } else {
        console.log("Form submitted successfully:", submissionData);
        alert("Form submitted successfully! Check console for data.");
      }
    }
  };

  const handleClear = () => {
    setFormData({});
    setErrors({});
    setValidationStates({});
    setTouchedFields({});
    setPatientAge("");
    setPatientGender("");

    if (onClear) {
      onClear();
    }
  };

  const renderInputField = (field, fieldKey) => {
    const value = formData[fieldKey] || "";
    const validation = errors[fieldKey];
    const validationState = validationStates[fieldKey];
    const isTouched = touchedFields[fieldKey];

    const getLabelText = () => {
      return (
        <>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </>
      );
    };

    const getInputStyles = () => {
      const showRequiredError = validationState === "error" && isTouched;
      const showRangeValidation = validationState && validationState === "outOfRange";

      switch (validationState) {
        case "within":
          return {
            container: "border-green-500 bg-green-50",
            input: "text-green-700 bg-green-50",
            unit: "text-green-700 border-green-300 bg-green-100",
            label: "border-green-300 bg-green-100 text-green-800",
          };
        case "outOfRange":
          return {
            container: "border-red-500 bg-red-50",
            input: "text-red-700 bg-red-50",
            unit: "text-red-700 border-red-300 bg-red-100",
            label: "border-red-300 bg-red-100 text-red-800",
          };
        case "error":
          if (showRequiredError) {
            return {
              container: "border-red-500 bg-red-50",
              input: "text-red-700 bg-red-50",
              unit: "text-red-700 border-red-300 bg-red-100",
              label: "border-red-300 bg-red-100 text-red-800",
            };
          }
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
      const showRequiredError = validationState === "error" && isTouched;

      switch (validationState) {
        case "within":
          return "text-green-800 bg-green-50 border-green-200";
        case "outOfRange":
          return "text-red-800 bg-red-50 border-red-200";
        case "error":
          if (showRequiredError) {
            return "text-red-800 bg-red-50 border-red-200";
          }
        default:
          return "text-blue-800 bg-blue-50 border-blue-200";
      }
    };

    const getMessageIcon = () => {
      const showRequiredError = validationState === "error" && isTouched;

      switch (validationState) {
        case "within":
          return "✅";
        case "outOfRange":
          return "❌";
        case "error":
          if (showRequiredError) {
            return "❌";
          }
        default:
          return "ℹ️";
      }
    };

    const styles = getInputStyles();
    const standardRangeText = getStandardRangeText(field);
    const showRequiredError = validationState === "error" && isTouched;

    switch (field.type) {
      case "text":
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
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                  required={field.required}
                />
                {field.unit && (
                  <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
                )}
              </div>
            </div>

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
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
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm resize-none border-0 ${styles.input}`}
                  required={field.required}
                />
                {field.unit && <div className={`px-3 py-2 text-sm border-t ${styles.unit}`}>Unit: {field.unit}</div>}
              </div>
            </div>

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
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
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  step="any"
                  className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                  required={field.required}
                />
                {field.unit && (
                  <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
                )}
              </div>
            </div>

            {standardRangeText && !value && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {standardRangeText}
                </div>
              </div>
            )}

            {validation && value && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}

            {showRequiredError && (
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
          <div className="space-y-2">
            <div className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden ${styles.container}`}>
              <label
                className={`w-full sm:w-32 px-3 py-2 sm:py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r flex items-center ${styles.label}`}
              >
                {getLabelText()}
              </label>
              <div className="flex-1 flex items-center">
                <SelectField
                  label=""
                  name={fieldKey}
                  value={value}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  options={field.options?.map((option) => ({ value: option, label: option })) || []}
                  placeholder="Select an option"
                />
                {field.unit && (
                  <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
                )}
              </div>
            </div>

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
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
                        name={fieldKey}
                        value={option}
                        checked={value === option}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
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

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
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
                          onChange={(e) => handleCheckboxChange(fieldKey, option, e.target.checked)}
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

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );

      default:
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
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={`flex-1 px-3 py-2 sm:py-3 focus:outline-none text-sm border-0 ${styles.input}`}
                  required={field.required}
                />
                {field.unit && (
                  <span className={`px-3 py-2 text-sm whitespace-nowrap border-l ${styles.unit}`}>{field.unit}</span>
                )}
              </div>
            </div>

            {showRequiredError && (
              <div className={`p-3 rounded-lg border ${getMessageStyles()}`}>
                <div className="text-sm">
                  {getMessageIcon()} {validation.message}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const renderFormField = (field, sectionIndex = null, fieldIndex) => {
    if (!field) return null;

    const fieldKey = generateFieldKey(field, sectionIndex, fieldIndex);

    return (
      <div key={fieldKey} className="space-y-2">
        {renderInputField(field, fieldKey)}
      </div>
    );
  };

  const getFieldsCount = () => {
    if (!schema) return 0;

    if (useSections && schema.sections) {
      return schema.sections.reduce((count, section) => count + (section.fields?.length || 0), 0);
    }

    return schema.fields?.length || 0;
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  // Move conditional returns to AFTER all hooks
  if (!schemaId) {
    return <div>No schema ID provided</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!schema) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 text-center text-gray-500">No form schema found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={() => setPopup(null)} />}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{schema.testName || "Form"}</h3>
            {schema.testDescription && <p className="text-sm text-gray-600 mt-1">{schema.testDescription}</p>}
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{getFieldsCount()} field(s)</div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {showPatientInfo && (
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

              {/* Gender Selection using SelectField */}
              <SelectField
                label="Patient Gender"
                name="patientGender"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                options={genderOptions}
                placeholder="Select gender"
              />
            </div>
            {(patientAge || patientGender) && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Current Selection:</strong>
                  {patientAge && ` Age: ${patientAge} years`}
                  {patientGender && ` Gender: ${patientGender}`}
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {useSections && schema.sections
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
              : (schema.fields || []).map((field, fieldIndex) => renderFormField(field, null, fieldIndex))}
          </div>

          {getFieldsCount() === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No fields configured in this form.
            </div>
          ) : (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClear}
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

export default SchemaRenderer;
