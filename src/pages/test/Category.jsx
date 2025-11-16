const Category = ({ name, tests, onAddTest, onEditTest, onDeleteTest, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="min-w-full border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 px-4 sm:px-6 py-5 mb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Category Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {tests.length} test{tests.length > 1 ? "s" : ""}
              </span>
              {/* Online Tests Count */}
              {tests.filter((test) => test.isOnline).length > 0 && (
                <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {tests.filter((test) => test.isOnline).length} online
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Modern Stack */}
        <div className="flex flex-col xs:flex-row gap-2 flex-shrink-0">
          <button
            onClick={onAddTest}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Test
          </button>

          <div className="flex gap-2">
            <button
              onClick={onEditCategory}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
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
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
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

      {/* Test List - Modern Grid Layout */}
      {tests.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {tests.map((test) => (
              <div
                key={test._id}
                className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  test.isOnline
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                }`}
              >
                {/* Online Status Badge */}
                {test.isOnline && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    Online
                  </div>
                )}

                {/* Test Content */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm truncate ${test.isOnline ? "text-green-900" : "text-blue-900"}`}
                    >
                      {test.testName}
                    </h4>
                    <p className={`text-xs mt-1 ${test.isOnline ? "text-green-600" : "text-blue-600"}`}>
                      {test.isOnline ? "Available online" : "Offline test"}
                    </p>
                  </div>

                  {/* Action Buttons - Modern Hover Effect */}
                  <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEditTest(test._id, test.testName, test.isOnline)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        test.isOnline
                          ? "bg-green-200 text-green-700 hover:bg-green-300"
                          : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                      }`}
                      title="Edit Test"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-110"
                      title="Delete Test"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Status Indicator */}
                <div className="flex items-center justify-between mt-3">
                  <div
                    className={`flex items-center gap-1.5 text-xs ${
                      test.isOnline ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${test.isOnline ? "bg-green-500 animate-pulse" : "bg-blue-400"}`}
                    ></div>
                    {test.isOnline ? "Live" : "Offline"}
                  </div>

                  {/* Quick Actions */}
                  <button
                    onClick={() => onEditTest(test._id, test.testName, test.isOnline)}
                    className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                      test.isOnline
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - Modern Design */}
      {tests.length === 0 && (
        <div className="mt-6 text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm mb-3">No tests in this category yet</p>
          <button
            onClick={onAddTest}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
