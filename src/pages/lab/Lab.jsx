const Lab = ({ input, index, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 px-6 py-2 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">

        {/* Fixed Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_120px_1fr_1fr] gap-4 flex-1">

          {/* Lab Name + ID */}
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-gray-900 text-nowrap overflow-hidden text-ellipsis">
              {index + 1}. {input.labName}
            </span>
            <span className="text-sm text-gray-700">
              Lab ID: <span className="font-mono">{input.labId}</span>
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                input.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {input.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-center text-gray-600">
            {input.address}
          </div>

          {/* Contact Numbers */}
          <div className="flex items-center text-gray-600 text-nowrap overflow-hidden text-ellipsis">
            {input.contact1}
            {input.contact2 && `, ${input.contact2}`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center lg:justify-end gap-2">

          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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