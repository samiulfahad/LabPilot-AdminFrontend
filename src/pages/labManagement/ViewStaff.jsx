const ViewStaff = ({ staff }) => {
  const {
    name,
    username,
    email,
    phone,
    access,
    isActive,
    createdAt,
    createdBy,
    deactivatedAt,
    deactivatedBy,
    activatedAt,
    activatedBy,
    updatedAt,
    updatedBy,
  } = staff;

  // Helper function to check if a value exists and should be displayed
  const shouldDisplay = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <div className="w-full">
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">{name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
            {shouldDisplay(username) && <p className="text-gray-600 text-sm">@{username}</p>}
          </div>
        </div>
        {shouldDisplay(isActive) && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {shouldDisplay(email) && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm">@</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 text-sm">{email}</p>
            </div>
          </div>
        )}

        {shouldDisplay(phone) && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm">📞</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-gray-900 text-sm">{phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Created */}
        {shouldDisplay(createdAt) && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 text-xs">+</span>
              </div>
              <p className="text-blue-800 text-sm font-medium">Created</p>
            </div>
            <p className="text-gray-700 text-sm">{createdAt}</p>
            {shouldDisplay(createdBy) && <p className="text-gray-600 text-xs">By User ID: {createdBy}</p>}
          </div>
        )}

        {/* Updated */}
        {shouldDisplay(updatedAt) && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                <span className="text-yellow-600 text-xs">↻</span>
              </div>
              <p className="text-yellow-800 text-sm font-medium">Last Updated</p>
            </div>
            <p className="text-gray-700 text-sm">{updatedAt}</p>
            {shouldDisplay(updatedBy) && <p className="text-gray-600 text-xs">By User ID: {updatedBy}</p>}
          </div>
        )}

        {/* Activated */}
        {isActive && shouldDisplay(activatedAt) && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 text-xs">▶</span>
              </div>
              <p className="text-green-800 text-sm font-medium">Activated</p>
            </div>
            <p className="text-gray-700 text-sm">{activatedAt}</p>
            {shouldDisplay(activatedBy) && <p className="text-gray-600 text-xs">By User ID: {activatedBy}</p>}
          </div>
        )}

        {/* Deactivated */}
        {!isActive && shouldDisplay(deactivatedAt) && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 text-xs">⏸</span>
              </div>
              <p className="text-red-800 text-sm font-medium">Deactivated</p>
            </div>
            <p className="text-gray-700 text-sm">{deactivatedAt}</p>
            {shouldDisplay(deactivatedBy) && <p className="text-gray-600 text-xs">By User ID: {deactivatedBy}</p>}
          </div>
        )}
      </div>

      {/* Access Permissions */}
      {shouldDisplay(access) && access.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-gray-900">Access Permissions</h4>
            <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
              {access.length} permission{access.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {access.map((permission, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span className="text-gray-900 text-sm font-medium">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStaff;
