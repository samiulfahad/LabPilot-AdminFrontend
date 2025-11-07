import useLabManagementStore from "../../store/local/labManagementStore";

const Lab = ({ lab, onView, onAddAdmin, onAddSupportAdmin }) => {
  const { setView, setActiveModal, setSelectedLab } = useLabManagementStore();

  // Check if there's a support admin
  const hasSupportAdmin = lab.admins?.some((admin) => admin.username === "supportAdmin");

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
              setActiveModal("view");
              setView("labDetails", lab);
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
                setActiveModal("addAdmin")
                setSelectedLab(lab)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <span>+</span>
              Add Admin
            </button>
          </div>
          <div className="space-y-3">
            {lab.admins.map((admin, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${admin.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{admin.username}</p>
                    <p className="text-gray-500 text-sm">{admin.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setView("admin", admin)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    View
                  </button>
                  {admin.isActive ? (
                    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Deactivate
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Activate
                    </button>
                  )}
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
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
              <span>+</span>
              Add Staff
            </button>
          </div>
          <div className="space-y-3">
            {lab.staffs.map((staff, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${staff.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{staff.username}</p>
                    <p className="text-gray-500 text-sm">{staff.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setView("staff", staff)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    View
                  </button>
                  {staff.isActive ? (
                    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Deactivate
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Activate
                    </button>
                  )}
                  <button className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-medium transition-colors">
                    Edit
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
