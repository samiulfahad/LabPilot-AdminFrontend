const Category = ({ name, tests, onAddTest, onEditTest, onDeleteTest, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="min-w-full border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 px-4 sm:px-5 py-4 mb-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Medical Category Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {tests.length} test{tests.length > 1 ? "s" : ""}
              </span>
              {/* Online Tests Count */}
              {tests.filter((test) => test.isOnline).length > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {tests.filter((test) => test.isOnline).length} online
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact Design */}
        <div className="flex flex-col xs:flex-row gap-2 flex-shrink-0">
          <button
            onClick={onAddTest}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Test
          </button>

          <div className="flex gap-2">
            <button
              onClick={onEditCategory}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>

            <button
              onClick={onDeleteCategory}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-sm text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Test List - Compact Grid Layout */}
      {tests.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {tests.map((test) => (
              <div
                key={test._id}
                className={`group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  test.isOnline
                    ? "bg-green-50 border-green-200 hover:border-green-300"
                    : "bg-blue-50 border-blue-200 hover:border-blue-300"
                }`}
              >
                {/* Online Status Badge */}
                {test.isOnline && (
                  <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Online
                  </div>
                )}

                {/* Test Content */}
                <div className="flex items-center gap-2">
                  {/* Medical Test Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      test.isOnline ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {test.isOnline ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm truncate ${test.isOnline ? "text-green-900" : "text-blue-900"}`}
                    >
                      {test.testName}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          test.isOnline ? "bg-green-500 animate-pulse" : "bg-blue-400"
                        }`}
                      ></div>
                      <span className={`text-xs ${test.isOnline ? "text-green-600" : "text-blue-600"}`}>
                        {test.isOnline ? "Live" : "Offline"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEditTest(test._id, test.testName, test.isOnline)}
                      className={`p-1.5 rounded-md transition-colors ${
                        test.isOnline
                          ? "bg-green-200 text-green-700 hover:bg-green-300"
                          : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                      }`}
                      title="Edit Test"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Delete Test"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - Medical Theme */}
      {tests.length === 0 && (
        <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-3">No medical tests added yet</p>
          <button
            onClick={onAddTest}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add First Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
