const DefaultSchemaModal = ({ test, schemas, onSetDefault, onClose }) => {
  const handleSetDefault = (schemaId) => {
    onSetDefault(test._id, schemaId);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center mb-4">Set Default Schema for {test.name}</h2>

      {/* Available Schemas */}
      {schemas && schemas.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {schemas.map((schema, index) => (
            <div
              key={schema._id || index}
              className={`p-4 rounded-lg border transition-all ${
                test.defaultSchema === schema._id
                  ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{schema.name || "Unnamed Schema"}</span>
                    {test.defaultSchema === schema._id && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current Default
                      </span>
                    )}
                  </div>

                  {schema.description && <p className="text-sm text-gray-600 mb-2">{schema.description}</p>}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{schema.fields?.length || 0} fields</span>
                    {schema.version && <span>v{schema.version}</span>}
                    <span>Created: {new Date(schema.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ml-4">
                  {test.defaultSchema !== schema._id && (
                    <button
                      onClick={() => handleSetDefault(schema._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-yellow-700 font-medium">No schemas available</p>
          <p className="text-yellow-600 text-sm mt-1">Create schemas first to enable online testing for this test</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium">Default Schema Required</p>
            <p className="text-xs text-blue-600 mt-1">
              A default schema is required for online test functionality. Tests with default schemas will be marked as
              "Live" and available for online testing.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DefaultSchemaModal;
