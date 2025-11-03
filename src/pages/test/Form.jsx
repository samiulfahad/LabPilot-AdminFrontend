const TestForm = ({ onChange, data, onSubmit, formType, onClose }) => {
  let label;
  let btn;
  let title;
  if (formType === "addCategory" || formType === "editCategory") {
    title = "Add a new Category";
    btn = "Add Category";
    label = "Category Name";
    if (formType === "editCategory") {
      title = "Edit Category";
      btn = "Update Category";
    }

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <h2 className="text-center font-bold text-lg">{title}</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            name="categoryName"
            value={data.categoryName || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
            placeholder={`Enter ${label.toLowerCase()}`}
            autoFocus
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 mb-4 border-2 border-red-300 text-red-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 mb-4 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {btn}
          </button>
        </div>
      </form>
    );
  }

  if (formType === "addTest" || formType === "editTest") {
    title = "Add New Test";
    btn = "Add Test";
    label = "Test Name";
    if (formType === "editTest") {
      title = "Edit Test";
      btn = "Update Test";
    }

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <h2 className="text-center font-bold text-lg">{title}</h2>

          {/* Test Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
              name="testName"
              value={data.testName || ""}
              onChange={(e) => onChange(e.target.name, e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
              placeholder={`Enter ${label.toLowerCase()}`}
              autoFocus
            />
          </div>

          {/* Online Test Radio Buttons - IMPROVED VERSION */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Test Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  data.isOnline === true || data.isOnline === "true"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="isOnline"
                  value="true"
                  checked={data.isOnline === true || data.isOnline === "true"}
                  onChange={(e) => onChange(e.target.name, true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  required
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Online Test</span>
                </div>
              </label>

              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  data.isOnline === false || data.isOnline === "false"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="isOnline"
                  value="false"
                  checked={data.isOnline === false || data.isOnline === "false"}
                  onChange={(e) => onChange(e.target.name, false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  required
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Offline Test</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 mb-4 border-2 border-red-300 text-red-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 mb-4 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {btn}
          </button>
        </div>
      </form>
    );
  }
};

export default TestForm;
