import React, { useState } from "react";

const SchemaDisplay = ({ schema, useSections, useStandardRange, testStandardRange }) => {
  const [copied, setCopied] = useState(false);

  const cleanSchemaForDisplay = (schema) => {
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

    return cleanedSchema;
  };

  const copyToClipboard = async () => {
    const cleanedSchema = cleanSchemaForDisplay(schema);
    const schemaText = JSON.stringify(cleanedSchema, null, 2);

    try {
      await navigator.clipboard.writeText(schemaText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const cleanedSchema = cleanSchemaForDisplay(schema);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">JSON Schema</h3>
        <button
          onClick={copyToClipboard}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-colors"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
          <pre className="text-xs sm:text-sm font-mono text-gray-100 overflow-auto max-h-96 leading-relaxed">
            {JSON.stringify(cleanedSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemaDisplay;
