const Lab = ({ input, index, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 my-4 hover:shadow-lg transition-all duration-300 hover:border-gray-200 group relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Header section with lab identity */}
        <div className="flex-1 flex items-start gap-4">
          {/* Lab avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">L{index + 1}</span>
          </div>

          {/* Lab info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-gray-900 text-xl truncate">{input.labName}</h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  input.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1.5 ${
                    input.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></span>
                {input.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="font-mono bg-gray-50 px-2 py-1 rounded-lg text-xs">ID: {input.labId}</span>
            </div>
          </div>
        </div>

        {/* Quick info chips - hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Address chip */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-700 truncate max-w-[120px]">{input.address.split(",")[0]}</span>
          </div>

          {/* Contact chip */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-sm text-gray-700">{input.contact1}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 lg:gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center px-4 py-2.5 lg:px-5 lg:py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex-1 lg:flex-none"
          >
            <svg className="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="hidden lg:inline">Edit</span>
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center px-4 py-2.5 lg:px-5 lg:py-3 border border-red-200 text-sm font-semibold rounded-xl text-red-600 bg-white hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 flex-1 lg:flex-none"
          >
            <svg className="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden lg:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Expanded info on hover/focus - hidden by default, shown on detail view */}
      <div className="mt-4 pt-4 border-t border-gray-100 hidden group-hover:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
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
            </svg>
            <div>
              <span className="text-xs text-gray-500 font-medium block mb-1">Full Address</span>
              <span className="text-gray-700">{input.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
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
              <span className="text-xs text-gray-500 font-medium block mb-1">Contact Numbers</span>
              <div className="flex flex-col gap-1">
                <span className="text-gray-700">{input.contact1}</span>
                {input.contact2 && <span className="text-gray-700">{input.contact2}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
