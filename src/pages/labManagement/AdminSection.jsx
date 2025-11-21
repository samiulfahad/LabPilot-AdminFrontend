import Icons from "../../components/icons";
import useLabManagementStore from "./store";

const AdminSection = ({ lab, hasSupportAdmin, onAddSupportAdmin }) => {
  const { setModal, setPopup } = useLabManagementStore();

  const handleDeleteAdmin = (e, admin) => {
    e.preventDefault();
    const message = `Deleting admin - ${admin.username} from ${lab.labName}?`;
    setPopup({ type: "confirmation", message, action: "deleteAdmin", data: { labId: lab._id, adminId: admin._id } });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm">
      {/* Support Admin Alert - Inside Admin Section */}
      {!hasSupportAdmin && (
        <div className="mb-6 p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🛡️</span>
              </div>
              <div>
                <p className="text-amber-800 text-sm font-semibold">No Support Admin</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {/* <span className="sm:inline">Support</span> */}
            </button>
          )}
          <button
            onClick={() => {
              setModal({ view: "addAdminForm", data: lab });
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
                onClick={() => setModal({ view: "admin", data: admin })}
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
                onClick={(e) => handleDeleteAdmin(e, admin)}
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
  );
};

export default AdminSection;
