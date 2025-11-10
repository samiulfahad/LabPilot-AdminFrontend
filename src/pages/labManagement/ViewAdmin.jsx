import useLabManagement from "./store";

const ViewAdmin = () => {
  const { viewData } = useLabManagement();

  // Use viewData from store instead of props
  const admin = viewData;

  if (!admin) {
    return <div className="w-full p-8 text-center text-gray-500">No administrator data available</div>;
  }

  const {
    username,
    email,
    phone,
    isActive,
    createdAt,
    createdBy,
    deactivatedAt,
    deactivatedBy,
    activatedAt,
    activatedBy,
  } = admin;

  // Helper function to check if a value exists and should be displayed
  const shouldDisplay = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <div className="w-full">
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Administrator</h3>
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

      {/* Admin Badge */}
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-sm">⚡</span>
          </div>
          <div>
            <p className="text-purple-800 text-sm font-medium">Administrator Account</p>
            <p className="text-purple-600 text-xs">Full system access privileges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdmin;
