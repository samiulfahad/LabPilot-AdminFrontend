import React from "react";
import InputField from "./InputField";

const FormPreview = ({ schema, useSections, useTestReference, testReference, removeField, getFieldsCount }) => {
  const TextAreaField = ({ label, name, value, onChange, disabled = false, rows = 3 }) => {
    return (
      <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg">
        <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg flex items-center">
          {label}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className="flex-1 px-3 py-2 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg focus:outline-none resize-none"
        />
      </div>
    );
  };

  const SelectField = ({ label, name, value, onChange, options = [], disabled = false }) => {
    return (
      <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg">
        <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg flex items-center">
          {label}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 px-3 py-2 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg focus:outline-none"
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const RadioGroupField = ({ label, name, value, onChange, options = [], disabled = false }) => {
    return (
      <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg">
        <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg flex items-center">
          {label}
        </label>
        <div className="flex-1 px-3 py-2 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg space-y-2">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
                disabled={disabled}
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const CheckboxField = ({ label, name, checked, onChange, disabled = false }) => {
    return (
      <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg">
        <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg flex items-center">
          {label}
        </label>
        <div className="flex-1 px-3 py-2 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Checked</span>
        </div>
      </div>
    );
  };

  const FieldPreview = ({ field, onRemove }) => {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0 mb-3">
          <div>
            {field.required && <span className="text-red-600 ml-2">*</span>}
          </div>
          <div className="text-sm text-gray-500">
            {field.type}
            {field.unit && ` • ${field.unit}`}
          </div>
        </div>

        {/* Field Preview */}
        {["text", "number", "date", "datetime-local"].includes(field.type) && (
          <InputField label={field.label} required={field?.required} name={field.id} type={field.type} disabled={true} />
        )}

        {field.type === "textarea" && <TextAreaField label="" name={field.id} disabled={true} />}

        {field.type === "select" && (
          <SelectField label="" name={field.id} disabled={true} options={field.options || []} />
        )}

        {field.type === "radio" && (
          <RadioGroupField label="" name={field.id} disabled={true} options={field.options || []} />
        )}

        {field.type === "checkbox" && <CheckboxField label="" name={field.id} disabled={true} />}

        {/* Field Reference Value Display */}
        {field.reference && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
            <span className="font-medium text-blue-800">Field Reference: </span>
            {field.reference.type === "range" && (
              <span className="text-blue-700">
                {field.reference.min} - {field.reference.max}
              </span>
            )}
            {field.reference.type === "options" && (
              <span className="text-blue-700">{field.reference.options?.join(", ")}</span>
            )}
            {field.reference.type === "text" && <span className="text-blue-700">{field.reference.value}</span>}
          </div>
        )}

        <button type="button" onClick={onRemove} className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium">
          Remove Field
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Form Preview</h3>
      </div>
      <div className="p-4 lg:p-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-800 text-xl">{schema.testName || "Untitled Lab Test"}</h4>
            {schema.testDescription && <p className="text-sm text-gray-600 mt-1">{schema.testDescription}</p>}
            <p className="text-sm text-gray-500 mt-2">
              Total Fields: {getFieldsCount()}{" "}
              {useSections && schema.sections && `• Sections: ${schema.sections.length}`}
            </p>
          </div>

          {/* Test Reference Display */}
          {useTestReference && testReference && (
            <div className="border border-gray-300 rounded-lg p-4 bg-blue-50">
              <h5 className="font-semibold text-blue-800 text-lg mb-3">Test Reference Values</h5>
              {testReference.type === "options" && testReference.options.length > 0 && (
                <div className="space-y-2">
                  {testReference.options.map((option, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="font-medium text-gray-700">{option.key}:</span>
                      <span className="text-gray-600">{option.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {testReference.type === "text" && testReference.text && (
                <div className="bg-white p-3 rounded">
                  <span className="text-gray-700">{testReference.text}</span>
                </div>
              )}
            </div>
          )}

          {getFieldsCount() === 0 ? (
            <p className="text-gray-500 text-center py-8">No fields added to test</p>
          ) : useSections && schema.sections ? (
            schema.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <h5 className="font-semibold text-gray-800 text-lg">{section.name}</h5>
                  {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
                </div>

                {section.fields.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No fields in this section</p>
                ) : (
                  <div className="space-y-4">
                    {section.fields.map((field, fieldIndex) => (
                      <FieldPreview
                        key={fieldIndex}
                        field={field}
                        onRemove={() => removeField(sectionIndex, fieldIndex)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {schema.fields.map((field, fieldIndex) => (
                <FieldPreview key={fieldIndex} field={field} onRemove={() => removeField(null, fieldIndex)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
