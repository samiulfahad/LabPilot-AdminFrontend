import useLabManagementStore from "./store";
import Icons from "../../components/icons"; // Import the Icons object

const Lab = ({ lab, onAddSupportAdmin }) => {
  const { setActiveModal, setPopup, setPopupMessage, setPopupData } = useLabManagementStore();

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
                <Icons.Deactivate />
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

      {/* Support Admin Alert - Simplified */}
      {!hasSupportAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🛡️</span>
              </div>
              <div>
                <p className="text-amber-800 font-semibold">Support Admin Required</p>
                <p className="text-amber-600 text-sm">Add a support admin for customer support access</p>
              </div>
            </div>
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
            <div className="flex gap-2">
              {/* Add Support Admin Button - Only show if no support admin exists */}
              {!hasSupportAdmin && (
                <button
                  onClick={() => onAddSupportAdmin(lab._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:scale-105 text-sm"
                  title="Add Support Admin"
                >
                  <Icons.Add />
                  <span className="sm:inline">Support</span>
                </button>
              )}
              <button
                onClick={() => {
                  setActiveModal("addAdmin", lab);
                }}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:scale-105"
                title="Add Admin"
              >
                <Icons.Add />
              </button>
            </div>
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
                      <Icons.Deactivate />
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
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:scale-105"
              title="Add Staff"
            >
              <Icons.Add />
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
                      <Icons.Deactivate />
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
