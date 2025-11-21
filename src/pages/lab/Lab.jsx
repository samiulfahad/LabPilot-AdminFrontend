const Lab = ({ input, index, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 my-3 hover:shadow-md transition-all duration-300 group">
      {/* Mobile Compact View */}
      <div className="sm:hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">L{index + 1}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{input.labName}</h3>
              <p className="text-xs text-gray-500">
                ID: <span className="font-mono">{input.labId}</span>
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              input.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${input.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
            {input.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Expandable Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
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
            <span className="text-gray-600 truncate">{input.address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
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
            <span className="text-gray-600">{input.contact1}</span>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 border border-red-300 rounded-lg text-red-600 text-sm hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-row sm:items-center gap-4">
        {/* Lab Identity */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">L{index + 1}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{input.labName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              ID: <span className="font-mono">{input.labId}</span>
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
              input.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${input.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
            {input.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 flex-1">
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
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">Address</p>
            <p className="text-sm text-gray-700 truncate">{input.address}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-2 flex-1">
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
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">Contact</p>
            <div className="text-sm text-gray-700">
              <p className="truncate">{input.contact1}</p>
              {input.contact2 && <p className="truncate text-gray-600">{input.contact2}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lab;
