import React, { useState } from "react";

const SchemaDisplay = ({ schema, useSections }) => {
  const [copied, setCopied] = useState(false);

  const cleanSchemaForDisplay = (schema) => {
    const cleanedSchema = {
      ...schema,
      fields: schema.fields
        ? schema.fields.map((field) => {
            const cleanedField = { ...field };
            if (cleanedField.reference?.type === "none") {
              delete cleanedField.reference;
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
              if (cleanedField.reference?.type === "none") {
                delete cleanedField.reference;
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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">JSON Schema</h3>
        <button
          onClick={copyToClipboard}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-sm font-mono text-gray-100 overflow-auto max-h-96">
            {JSON.stringify(cleanedSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemaDisplay;
