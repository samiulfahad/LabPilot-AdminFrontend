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

  // SVG Icons for consistent styling
  const Icons = {
    Play: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
    Pause: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
      </svg>
    ),
    PowerOn: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
      </svg>
    ),
    PowerOff: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
        <path d="M12 7v6h2V7h-2z" />
      </svg>
    ),
    View: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    Edit: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    Delete: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    Add: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    Details: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-900 shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{lab.labName}</h3>
              <p className="text-gray-600">ID: {lab.labId}</p>
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
            <Icons.Details />
            Lab Details
          </button>
          <div className="flex gap-3">
            {lab.isActive ? (
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-white shadow-lg hover:shadow-amber-500/25 text-sm">
                <Icons.Pause />
                Deactivate
              </button>
            ) : (
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-white shadow-lg hover:shadow-emerald-500/25 text-sm">
                <Icons.Play />
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Support Admin Alert */}
      {!hasSupportAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl border border-amber-300 shadow-sm">
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
              className="w-full sm:w-auto px-6 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-white/90 transition-colors border border-white shadow-sm flex items-center gap-2"
            >
              <Icons.Add />
              Add Support Admin
            </button>
          </div>
        </div>
      )}

      {/* Admins and Staff Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Lab Admins Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">⚡</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Lab Admins</h4>
                <p className="text-blue-600 text-sm">{lab.admins?.length || 0} administrators</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal("addAdmin", lab);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Icons.Add />
              Add Admin
            </button>
          </div>
          <div className="space-y-3">
            {lab.admins.map((admin, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${admin.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{admin.username}</p>
                    <p className="text-gray-500 text-sm">{admin.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                {/* Admin Action Buttons */}
                <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveModal("viewAdmin", admin)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="View Admin"
                  >
                    <Icons.View />
                  </button>
                  {admin.isActive ? (
                    <button
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                      title="Deactivate Admin"
                    >
                      <Icons.PowerOff />
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      title="Activate Admin"
                    >
                      <Icons.PowerOn />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteAdmin(e, lab, admin)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Delete Admin"
                  >
                    <Icons.Delete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Staff Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-lg">👥</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Lab Staff</h4>
                <p className="text-green-600 text-sm">{lab.staffs?.length || 0} team members</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal("addStaff", lab);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Icons.Add />
              Add Staff
            </button>
          </div>
          <div className="space-y-2">
            {lab.staffs.map((staff, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${staff.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{staff.username}</p>
                    <p className="text-gray-500 text-sm">{staff.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                {/* Staff Action Buttons */}
                <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveModal("viewStaff", staff)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="View Staff"
                  >
                    <Icons.View />
                  </button>
                  {staff.isActive ? (
                    <button
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                      title="Deactivate Staff"
                    >
                      <Icons.PowerOff />
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      title="Activate Staff"
                    >
                      <Icons.PowerOn />
                    </button>
                  )}
                  <button
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    title="Edit Staff"
                  >
                    <Icons.Edit />
                  </button>
                  <button
                    onClick={(e) => handleDeleteStaff(e, lab, staff)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Delete Staff"
                  >
                    <Icons.Delete />
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
