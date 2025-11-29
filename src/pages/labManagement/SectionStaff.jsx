import Icons from "../../components/icons";
import useLabManagementStore from "./store";

const StaffSection = ({ lab }) => {
  const { setModal, setPopup } = useLabManagementStore();

  const handleDeleteStaff = (e, staff) => {
    e.preventDefault();
    const message = `Deleting staff - ${staff.username} from ${lab.name}?`;
    setPopup({ type: "confirmation", message, action: "deleteStaff", data: { staffId: staff._id, labId: lab._id } });
  };

  const handleActivateStaff = (e, staff) => {
    e.preventDefault();
    const message = `Activating staff - ${staff.username} from ${lab.name}?`;
    setPopup({ type: "confirmation", message, action: "activateStaff", data: { staffId: staff._id, labId: lab._id } });
  };

  const handleDeactivateStaff = (e, staff) => {
    e.preventDefault();
    const message = `Deactivating staff - ${staff.username} from ${lab.name}?`;
    setPopup({
      type: "confirmation",
      message,
      action: "deactivateStaff",
      data: { staffId: staff._id, labId: lab._id },
    });
  };

  return (
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
            setModal({ view: "addStaffForm", data: lab });
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
                onClick={() => setModal({ view: "staff", data: staff })}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                title="View Staff"
              >
                <Icons.View />
              </button>
              {staff.isActive ? (
                <button
                  onClick={(e) => handleDeactivateStaff(e, staff)}
                  className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  title="Deactivate Staff"
                >
                  <Icons.Deactivate />
                </button>
              ) : (
                <button
                  onClick={(e) => handleActivateStaff(e, staff)}
                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  title="Activate Staff"
                >
                  <Icons.PowerOn />
                </button>
              )}
              <button
                onClick={(e) => handleDeleteStaff(e, staff)}
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
  );
};

export default StaffSection;
