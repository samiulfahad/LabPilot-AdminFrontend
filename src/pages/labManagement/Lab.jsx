import useLabManagementStore from "./store";

const Lab = ({ lab, onAddSupportAdmin }) => {
  const { setActiveModal, deleteStaff, setPopup, setPopupMessage, setPopupData } = useLabManagementStore();

  // Check if there's a support admin
  const hasSupportAdmin = lab.admins?.some((admin) => admin.username === "supportAdmin");

  const handleDeleteAdmin = (e, lab, admin) => {
    e.preventDefault();
    setPopup("deleteAdmin");
    setPopupData({ labId: lab._id, adminId: admin._id });
    const message = (
      <div className="text-start">
        <p>
          Username: <span className="font-bold">{admin.username}</span>
        </p>
        <p>
          Lab ID: <span className="font-bold">{lab.labId}</span>
        </p>
        <p>
          Lab Name: <span className="font-bold">{lab.labName}</span>
        </p>
      </div>
    );
    setPopupMessage(message);
  };

  const handleDeleteStaff = (e, lab, staff) => {
    e.preventDefault();
    setPopup("deleteStaff");
    setPopupData({ labId: lab._id, staffId: staff._id });

    const message = (
      <div className="text-start">
        <p>
          Username: <span className="font-bold">{staff.username}</span>
        </p>
        <p>
          Access: <span className="font-bold">{staff.access}</span>
        </p>
        <p>
          Lab ID: <span className="font-bold">{lab.labId}</span>
        </p>
        <p>
          Lab Name: <span className="font-bold">{lab.labName}</span>
        </p>
      </div>
    );

    setPopupMessage(message);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-900 shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 truncate">{lab.labName}</h3>
              <p className="text-gray-600 truncate">ID: {lab.labId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${lab.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm text-gray-600">{lab.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👥 {lab.staffs?.length || 0} Staff</span>
              <span>⚡ {lab.admins?.length || 0} Admins</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Modern Stack */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-48">
          <button
            onClick={() => {
              setActiveModal("viewLabDetails", lab);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/25"
          >
            <span>📋</span>
            Lab Details
          </button>
          <div className="flex gap-3">
            {lab.isActive ? (
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 text-white shadow-lg hover:shadow-red-500/25 text-sm">
                <span>⏸️</span>
                Deactivate
              </button>
            ) : (
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 text-white shadow-lg hover:shadow-green-500/25 text-sm">
                <span>▶️</span>
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Support Admin Alert */}
      {!hasSupportAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl border border-yellow-300 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-lg">🛡️</span>
              </div>
              <div>
                <p className="text-white font-semibold">No Support Admin</p>
                <p className="text-white/90 text-sm">Add a support admin for customer support</p>
              </div>
            </div>
            <button
              onClick={() => onAddSupportAdmin(lab._id)}
              className="w-full sm:w-auto px-6 py-2 bg-white text-yellow-600 rounded-lg font-medium hover:bg-white/90 transition-colors border border-white shadow-sm"
            >
              + Add Support Admin
            </button>
          </div>
        </div>
      )}

      {/* Admins and Staff Section - Improved for mobile */}
      <div className="space-y-6 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-6">
        {/* Lab Admins Card - Larger and cleaner */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Lab Admins</h4>
                <p className="text-blue-600 text-sm">{lab.admins?.length || 0} administrators</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal("addAdmin", lab);
              }}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>+</span>
              Add Admin
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {lab.admins?.map((admin, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-0 flex-1 min-w-0">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${admin.isActive ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate text-lg">{admin.username}</p>
                    <p className="text-gray-500 text-sm">{admin.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>

                {/* Admin Action Buttons - Always visible on mobile */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <button
                    onClick={() => setActiveModal("viewAdmin", admin)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="View Admin"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  {admin.isActive ? (
                    <button className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap">
                      Deactivate
                    </button>
                  ) : (
                    <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors whitespace-nowrap">
                      Activate
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteAdmin(e, lab, admin)}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Delete Admin"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Staff Card - Larger and cleaner */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Lab Staff</h4>
                <p className="text-green-600 text-sm">{lab.staffs?.length || 0} team members</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal("addStaff", lab);
              }}
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>+</span>
              Add Staff
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {lab.staffs?.map((staff, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-0 flex-1 min-w-0">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${staff.isActive ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate text-lg">{staff.username}</p>
                    <p className="text-gray-500 text-sm">{staff.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>

                {/* Staff Action Buttons - Always visible on mobile */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <button
                    onClick={() => setActiveModal("viewStaff", staff)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="View Staff"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  {staff.isActive ? (
                    <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors whitespace-nowrap">
                      Deactivate
                    </button>
                  ) : (
                    <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors whitespace-nowrap">
                      Activate
                    </button>
                  )}
                  <button
                    className="p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Edit Staff"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteStaff(e, lab, staff)}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Delete Staff"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
