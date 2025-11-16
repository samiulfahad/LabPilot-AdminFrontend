const Lab = ({ input, index, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-xl border border-gray-100 px-5 py-5 my-3 hover:shadow-md transition-all duration-300 hover:border-gray-200 group">
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center">
        {/* Main Content - Desktop: Single row, Mobile: Stacked */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr_2fr] gap-4 sm:gap-6">
          {/* Lab Name + ID */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">L{index + 1}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 text-lg block">{input.labName}</span>
                <span className="text-sm text-gray-500 mt-0.5">
                  Lab ID: <span className="font-mono text-gray-700">{input.labId}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center sm:justify-center">
            <span
              className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                input.isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "bg-red-50 text-red-700 border border-red-200 shadow-sm"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2.5 ${
                  input.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`}
              ></span>
              {input.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Address */}
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <span className="text-xs text-gray-500 font-medium block mb-1">Address</span>
                <span className="text-sm text-gray-700 leading-tight">{input.address}</span>
              </div>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <span className="text-xs text-gray-500 font-medium block mb-1">Contact</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-700">{input.contact1}</span>
                  {input.contact2 && <span className="text-sm text-gray-700">{input.contact2}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-3 sm:ml-4">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm focus:outline-none transition-all duration-200 group-hover:border-gray-300"
          >
            <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="inline-flex items-center justify-center px-5 py-3 border border-red-200 text-sm font-semibold rounded-xl text-red-600 bg-white hover:bg-red-50 hover:border-red-300 hover:shadow-sm focus:outline-none transition-all duration-200 group-hover:border-red-300"
          >
            <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
