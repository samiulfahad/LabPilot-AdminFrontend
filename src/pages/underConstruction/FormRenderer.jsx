import { useState, useEffect } from "react";
import useStore from "./store";

const FormRenderer = () => {
  const { schema } = useStore();

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [formData, setFormData] = useState({});
  const [statuses, setStatuses] = useState({});

  const hasMultipleSections = schema.sections?.length > 1;

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
    schema.sections.forEach((section) => {
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
  }, [age, gender]);

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

    // Compute status for this field
    const field = findField(fieldName);
    if (field) {
      const newStatus = computeStatus(field, value, gender, age);
      setStatuses((prev) => ({ ...prev, [fieldName]: newStatus }));
    }
  };

  const findField = (name) => {
    for (let section of schema.sections || []) {
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

    let inputElement;
    switch (type) {
      case "input":
        inputElement = (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            maxLength={maxLength}
            required={required}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
          />
        );
        break;
      case "textarea":
        inputElement = (
          <textarea
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            maxLength={maxLength}
            required={required}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm min-h-[100px]"
          />
        );
        break;
      case "select":
        inputElement = (
          <select
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
        break;
      case "radio":
        inputElement = (
          <div className="space-y-3">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleChange(name, e.target.value)}
                  required={required}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-200 rounded-full transition-all duration-200"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
        break;
      case "checkbox":
        inputElement = (
          <div className="space-y-3">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={opt}
                  checked={value.includes(opt)}
                  onChange={(e) => handleChange(name, opt, true)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-200 rounded-md transition-all duration-200"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
        break;
      case "number":
        inputElement = (
          <div className="flex items-center">
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              required={required}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            {unit && <span className="ml-3 text-gray-600 font-medium">{unit}</span>}
          </div>
        );
        break;
      default:
        return null;
    }

    return (
      <div key={name} className="mb-6">
        <label className="block mb-2 font-semibold text-gray-800">
          {name} {required ? <span className="text-red-500">*</span> : ""}
        </label>
        {inputElement}
        {range && (
          <p className="mt-2 text-sm text-gray-500">
            Standard Range {range.info ? `${range.info} ` : ""}is {range.min} - {range.max} {unit}
          </p>
        )}
        {status && (
          <p className={`mt-2 text-sm font-medium ${status === "within" ? "text-green-600" : "text-red-600"}`}>
            Value is {status} the standard range.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 my-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{schema.name || "Form Renderer"}</h2>
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Patient Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
      {schema.sections.map((section) => (
        <div key={section.name} className="mb-10">
          {hasMultipleSections && (
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">{section.name}</h3>
          )}
          {(section.fields || []).map((field) => renderField(field))}
        </div>
      ))}
    </div>
  );
};

export default FormRenderer;
