import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
import TextAreaField from "../../components/html/TextAreaField";
import schemaService from "../../services/schemaService";

const FormRenderer = () => {
  const [schema, setSchema] = useState(null);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [formData, setFormData] = useState({});
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const { schemaId } = useParams();
  if (!schemaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Form Found</h3>
          <p className="text-gray-600">Please check the form URL and try again.</p>
        </div>
      </div>
    );
  }

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const { data } = await schemaService.getById(schemaId);
      setSchema(data);
    } catch (error) {
      console.error("Error fetching schema:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schemaId) {
      fetchSchema();
    }
  }, [schemaId]);

  const hasMultipleSections = schema?.sections?.length > 1;

  const computeStatus = (field, value, gender, age) => {
    if (field.type === "number" && field.standardRange) {
      const range = getApplicableRange(field.standardRange, gender, age);
      if (range) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (numValue < range.min) return "below";
          else if (numValue > range.max) return "above";
          else return "within";
        }
      }
    }
    return "";
  };

  const updateAllStatuses = () => {
    const newStatuses = {};
    schema?.sections?.forEach((section) => {
      section.fields.forEach((field) => {
        const value = formData[field.name];
        if (value !== undefined) {
          newStatuses[field.name] = computeStatus(field, value, gender, age);
        }
      });
    });
    setStatuses(newStatuses);
  };

  useEffect(() => {
    updateAllStatuses();
  }, [age, gender, schema]);

  const handleChange = (fieldName, value, isCheckbox = false) => {
    setFormData((prev) => {
      if (isCheckbox) {
        const currentValues = prev[fieldName] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [fieldName]: newValues };
      }
      return { ...prev, [fieldName]: value };
    });

    const field = findField(fieldName);
    if (field) {
      const newStatus = computeStatus(field, value, gender, age);
      setStatuses((prev) => ({ ...prev, [fieldName]: newStatus }));
    }
  };

  const findField = (name) => {
    for (let section of schema?.sections || []) {
      for (let field of section.fields || []) {
        if (field.name === name) return field;
      }
    }
    return null;
  };

  const getApplicableRange = (sr, g, a) => {
    if (!g || !a) return null;
    const ageNum = parseFloat(a);
    if (isNaN(ageNum)) return null;
    const { type, data } = sr;

    let min,
      max,
      info = "";

    if (type === "simple") {
      min = parseFloat(data.min);
      max = parseFloat(data.max);
      info = "";
    } else if (type === "gender") {
      const gd = data[g.toLowerCase()];
      if (gd) {
        min = parseFloat(gd.min);
        max = parseFloat(gd.max);
        info = `for ${g.charAt(0).toUpperCase() + g.slice(1)}`;
      }
    } else if (type === "age") {
      for (let entry of data) {
        const minA = parseFloat(entry.minAge);
        const maxA = entry.maxAge !== 999 ? parseFloat(entry.maxAge) : Infinity;
        if (ageNum >= minA && ageNum <= maxA) {
          min = parseFloat(entry.minValue);
          max = parseFloat(entry.maxValue);
          const ageStr = `${entry.minAge}${entry.maxAge === 999 ? "+" : "-" + entry.maxAge}`;
          info = `for age ${ageStr}`;
          break;
        }
      }
    } else if (type === "combined") {
      for (let entry of data) {
        if (entry.gender.toLowerCase() === g.toLowerCase()) {
          const minA = parseFloat(entry.minAge);
          const maxA = entry.maxAge !== 999 ? parseFloat(entry.maxAge) : Infinity;
          if (ageNum >= minA && ageNum <= maxA) {
            min = parseFloat(entry.minValue);
            max = parseFloat(entry.maxValue);
            const ageStr = `${entry.minAge}${entry.maxAge === 999 ? "+" : "-" + entry.maxAge}`;
            info = `for ${entry.gender.charAt(0).toUpperCase() + entry.gender.slice(1)}, age ${ageStr}`;
            break;
          }
        }
      }
    }

    if (min !== undefined && max !== undefined) {
      return { min, max, info };
    }
    return null;
  };

  const renderField = (field) => {
    const { name, type, required, options = [], maxLength, unit = "", standardRange } = field;
    const value = formData[name] || (type === "checkbox" ? [] : "");
    const range = standardRange ? getApplicableRange(standardRange, gender, age) : null;
    const status = statuses[name] || "";
    const labelText = `${name}${unit ? ` (${unit})` : ""}${required ? " *" : ""}`;

    const getStatusIcon = (status) => {
      switch (status) {
        case "within":
          return (
            <span className="flex items-center text-emerald-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Within range
            </span>
          );
        case "above":
        case "below":
          return (
            <span className="flex items-center text-rose-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {status === "above" ? "Above range" : "Below range"}
            </span>
          );
        default:
          return null;
      }
    };

    let inputElement;
    switch (type) {
      case "input":
        inputElement = (
          <InputField
            label={labelText}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            type="text"
            maxLength={maxLength}
            required={required}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        );
        break;
      case "textarea":
        inputElement = (
          <TextAreaField
            label={labelText}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            maxLength={maxLength}
            required={required}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={4}
          />
        );
        break;
      case "select":
        inputElement = (
          <SelectField
            label={labelText}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            options={options.map((opt) => ({ value: opt, label: opt }))}
            placeholder="Select an option"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        );
        break;
      case "radio":
        inputElement = (
          <div className="space-y-3">
            <label className="block mb-3 text-sm font-medium text-gray-700">
              {name} {required && <span className="text-rose-500">*</span>}
            </label>
            {options.map((opt) => (
              <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name={name}
                    value={opt}
                    checked={value === opt}
                    onChange={(e) => handleChange(name, e.target.value)}
                    required={required}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all duration-200 appearance-none checked:border-blue-600"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-2 h-2 rounded-full bg-blue-600 transform scale-0 transition-transform duration-200 ${
                        value === opt ? "scale-100" : ""
                      }`}
                    />
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{opt}</span>
              </label>
            ))}
          </div>
        );
        break;
      case "checkbox":
        inputElement = (
          <div className="space-y-3">
            <label className="block mb-3 text-sm font-medium text-gray-700">
              {name} {required && <span className="text-rose-500">*</span>}
            </label>
            {options.map((opt) => (
              <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={value.includes(opt)}
                    onChange={(e) => handleChange(name, opt, true)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-all duration-200 appearance-none checked:border-blue-600 checked:bg-blue-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      className={`w-3 h-3 text-blue-600 transform scale-0 transition-transform duration-200 ${
                        value.includes(opt) ? "scale-100" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{opt}</span>
              </label>
            ))}
          </div>
        );
        break;
      case "number":
        inputElement = (
          <InputField
            label={labelText}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            type="number"
            required={required}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        );
        break;
      default:
        return null;
    }

    return (
      <div key={name} className="mb-8 last:mb-0">
        {inputElement}
        {range && (
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Standard range {range.info}: {range.min} - {range.max} {unit}
          </p>
        )}
        {status && <div className="flex items-center text-sm mt-2">{getStatusIcon(status)}</div>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h3>
          <p className="text-gray-600">Unable to load the form schema. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{schema.name || "Medical Form"}</h1>
              <p className="text-gray-600 mt-2">Please fill in all required fields marked with *</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Auto-save enabled</span>
            </div>
          </div>

          {/* Progress Bar */}
          {hasMultipleSections && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {schema.sections.map((section, index) => (
                  <button
                    key={section.name}
                    onClick={() => setActiveSection(index)}
                    className={`flex-1 text-center py-3 font-medium transition-all duration-200 ${
                      activeSection === index
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((activeSection + 1) / schema.sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Patient Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SelectField
                label="Gender *"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div>
              <InputField
                label="Age *"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                placeholder="Enter age"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Gender and age are required for accurate range calculations
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {schema.sections.map((section, sectionIndex) => (
            <div
              key={section.name}
              className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 ${
                hasMultipleSections && activeSection !== sectionIndex ? "opacity-50" : ""
              }`}
            >
              {hasMultipleSections && (
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-gray-700">{sectionIndex + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                </div>
              )}
              <div className="space-y-8">{(section.fields || []).map((field) => renderField(field))}</div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{Object.keys(formData).length}</span> fields completed
            </div>
            <div className="flex space-x-4">
              <button
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                onClick={() => setFormData({})}
              >
                Clear All
              </button>
              <button
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => console.log("Submit:", formData)}
              >
                Submit Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
