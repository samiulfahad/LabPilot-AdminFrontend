import useLabManagementStore from "./store";

const ViewLabDetails = () => {
  const { modal, closeModal } = useLabManagementStore();

  const lab = modal.data;

  if (!lab) {
    return <div className="w-full p-8 text-center text-gray-500">No lab data available</div>;
  }

  const {
    labName,
    labId,
    address,
    contact1,
    contact2,
    email,
    isActive,
    labIncentive,
    invoicePrice,
    hasWarning,
    warning,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  } = lab;

  // Helper function to check if a value exists and should be displayed
  const shouldDisplay = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  // Calculate software gets
  const softwareGets = invoicePrice - labIncentive;

  // Dummy data for new fields
  const monthlyFee = 500;
  const totalTests = 300;

  return (
    <div className="w-full">
      {/* Fixed Sticky Close Button at Top */}
      <div className="sticky top-0 z-10 bg-white pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{labName}</h3>
              <p className="text-gray-600 text-sm">Lab ID: {labId}</p>
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
          {shouldDisplay(address) && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">📍</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="text-gray-900 text-sm">{address}</p>
              </div>
            </div>
          )}

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

          {shouldDisplay(contact1) && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📞</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Primary Contact</p>
                <p className="text-gray-900 text-sm">{contact1}</p>
              </div>
            </div>
          )}

          {shouldDisplay(contact2) && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📞</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Secondary Contact</p>
                <p className="text-gray-900 text-sm">{contact2}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Information - Now 5 items in 2 rows on mobile */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* First Row */}
          {shouldDisplay(invoicePrice) && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📄</span>
                </div>
              </div>
              <p className="text-blue-800 text-xs font-medium mb-1">Invoice</p>
              <p className="text-gray-700 text-xs font-semibold">৳{invoicePrice}</p>
            </div>
          )}

          {shouldDisplay(labIncentive) && (
            <div className="p-2 bg-green-50 rounded-lg border border-green-200 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs">🏥</span>
                </div>
              </div>
              <p className="text-green-800 text-xs font-medium mb-1">Lab Gets</p>
              <p className="text-gray-700 text-xs font-semibold">৳{labIncentive}</p>
            </div>
          )}

          {shouldDisplay(invoicePrice) && shouldDisplay(labIncentive) && (
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-xs">💻</span>
                </div>
              </div>
              <p className="text-purple-800 text-xs font-medium mb-1">Software</p>
              <p className="text-gray-700 text-xs font-semibold">৳{softwareGets}</p>
            </div>
          )}
        </div>

        {/* Second Row for Monthly Fee and Total Tests */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                <span className="text-orange-600 text-xs">💰</span>
              </div>
            </div>
            <p className="text-orange-800 text-xs font-medium mb-1">Monthly Fee</p>
            <p className="text-gray-700 text-xs font-semibold">৳{monthlyFee}</p>
          </div>

          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                <span className="text-indigo-600 text-xs">🧪</span>
              </div>
            </div>
            <p className="text-indigo-800 text-xs font-medium mb-1">Total Tests</p>
            <p className="text-gray-700 text-xs font-semibold">{totalTests}</p>
          </div>
        </div>

        {/* Warning Section */}
        <div className="mb-6">
          {hasWarning && shouldDisplay(warning) ? (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-600 text-xs">⚠️</span>
                </div>
                <p className="text-red-800 text-sm font-medium">Warning</p>
              </div>
              <p className="text-gray-700 text-sm">{warning}</p>
            </div>
          ) : (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs">✅</span>
                </div>
                <p className="text-green-800 text-sm font-medium">No Warnings</p>
              </div>
              <p className="text-gray-600 text-sm">This lab has no active warnings</p>
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
        </div>

        {/* Statistics - Now side by side on mobile */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 text-xs mb-1">Staff</p>
            <p className="text-gray-900 text-sm font-semibold">{lab.staffs?.length || 0}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 text-xs mb-1">Admins</p>
            <p className="text-gray-900 text-sm font-semibold">{lab.admins?.length || 0}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 text-xs mb-1">Referrers</p>
            <p className="text-gray-900 text-sm font-semibold">{lab.referrers?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLabDetails;
