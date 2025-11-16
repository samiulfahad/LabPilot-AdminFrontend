const Category = ({ name, tests, onAddTest, onEditTest, onDeleteTest, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="min-w-full border border-gray-200 rounded-lg bg-white shadow-sm px-4 sm:px-5 py-4 mb-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 break-words flex-1">{name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
            {tests.length} test{tests.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Category Action Buttons - Stack on mobile, inline on desktop */}
        <div className="flex flex-col xs:flex-row gap-2 flex-shrink-0">
          <button
            onClick={onAddTest}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="sm:block">Add Test</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onEditCategory}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="sm:block">Edit</span>
            </button>

            <button
              onClick={onDeleteCategory}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="sm:block">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test List */}
      {tests.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {tests.map((test) => (
              <div
                key={test._id}
                className={`flex items-center border rounded-md group hover:bg-blue-100 transition-colors min-w-0 flex-1 xs:flex-none ${
                  test.isOnline ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                {/* Test Name with Online Indicator */}
                <div className="flex items-center gap-2 px-3 py-2 sm:py-1 flex-1 min-w-0">
                  <span className="text-sm font-medium truncate flex-1">{test.testName}</span>
                  {/* Online Status Indicator */}
                  {test.isOnline && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-700 font-medium hidden xs:inline">Online</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex border-l flex-shrink-0 ${test.isOnline ? "border-green-300" : "border-blue-300"}`}
                >
                  <button
                    onClick={() => onEditTest(test._id, test.testName, test.isOnline)}
                    className={`p-2 sm:p-1.5 hover:bg-blue-200 transition-colors ${
                      test.isOnline ? "text-green-600 hover:bg-green-200" : "text-blue-600"
                    }`}
                    title="Edit Test"
                  >
                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDeleteTest(test._id, test.testName)}
                    className={`p-2 sm:p-1.5 hover:bg-red-200 transition-colors ${
                      test.isOnline ? "text-red-600" : "text-red-600"
                    }`}
                    title="Delete Test"
                  >
                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tests.length === 0 && (
        <div className="mt-4 text-center py-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm mb-2">No tests added yet</p>
          <button
            onClick={onAddTest}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add first test
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
