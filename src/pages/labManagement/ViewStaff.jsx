import useLabManagementStore from "./store";

const ViewStaff = () => {
  const { modalData, closeModal } = useLabManagementStore();
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
  } = modalData;

  // Access options matching the add staff form
  const accessOptions = ["createInvoice", "readInvoice", "updateInvoice", "readCashmemo", "uploadReport"];

  // Helper function to check if a value exists and should be displayed
  const shouldDisplay = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  // Format permission name to match add staff form display with proper capitalization
  const formatPermissionName = (permission) => {
    // First add spaces before capital letters
    const withSpaces = permission.replace(/([A-Z])/g, " $1");
    // Capitalize the first letter of each word
    return withSpaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="w-full">
      {/* Fixed Sticky Header at Top */}
      <div className="sticky top-0 z-10 bg-white pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{name?.charAt(0)?.toUpperCase() || "U"}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
              {shouldDisplay(username) && <p className="text-gray-600 text-sm">@{username}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {shouldDisplay(isActive) && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </div>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
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

        {/* Access Permissions - Updated to match add staff form */}
        <div className="mb-6">
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Access Permissions</label>
            <div className="grid grid-cols-2 gap-3">
              {accessOptions.map((accessItem) => {
                const hasAccess = access?.includes(accessItem);
                return (
                  <div
                    key={accessItem}
                    className={`flex items-center p-2 rounded-lg border ${
                      hasAccess ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                        hasAccess ? "bg-green-500 border-green-600" : "bg-white border-gray-400"
                      }`}
                    >
                      {hasAccess && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${hasAccess ? "text-green-800" : "text-gray-600"}`}>
                      {formatPermissionName(accessItem)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {access?.length || 0} of {accessOptions.length} permissions granted
              </p>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default ViewStaff;
