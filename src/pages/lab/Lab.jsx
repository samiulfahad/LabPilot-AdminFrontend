const Lab = ({ input, index, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 px-4 py-4 sm:px-6 sm:py-3 my-2 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center">
        {/* Main Content - Desktop: Single row, Mobile: Stacked */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr_2fr] gap-3 sm:gap-4">
          {/* Lab Name + ID */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-base sm:text-sm">
              {index + 1}. {input.labName}
            </span>
            <span className="text-sm text-gray-700 mt-1 sm:mt-0">
              Lab ID:{" "}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs sm:bg-transparent sm:px-0 sm:py-0">
                {input.labId}
              </span>
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center sm:justify-center">
            <span
              className={`inline-flex items-center px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-sm font-medium ${
                input.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 sm:hidden ${input.isActive ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              {input.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Address */}
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600">
            <span className="text-xs text-gray-500 font-medium sm:hidden mb-1">Address:</span>
            <span className="text-sm truncate">{input.address}</span>
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600">
            <span className="text-xs text-gray-500 font-medium sm:hidden mb-1">Contact:</span>
            <span className="text-sm truncate">
              {input.contact1}
              {input.contact2 && `, ${input.contact2}`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row justify-center gap-2 sm:flex sm:justify-end sm:gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center px-4 py-2.5 sm:px-3 sm:py-2 border border-gray-300 text-sm font-medium rounded-lg sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            onClick={onDelete}
            className="inline-flex items-center justify-center px-4 py-2.5 sm:px-3 sm:py-2 border border-red-300 text-sm font-medium rounded-lg sm:rounded-md text-red-700 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </section>
  );
};

export default Lab;
