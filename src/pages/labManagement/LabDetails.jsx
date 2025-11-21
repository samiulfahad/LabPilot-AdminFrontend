import Icons from "../../components/icons";
import useLabManagementStore from "./store";

const LabDetails = ({ lab }) => {
  const { setPopup, setModal } = useLabManagementStore();

  const handleDeactivate = () => {
    setPopup({
      type: "confirmation",
      action: "deactivateLab",
      message: `Deactivate Lab ${lab.labName}?`,
      data: { labId: lab._id },
    });
  };

  const handleActivate = () => {
    setPopup({
      type: "confirmation",
      action: "activateLab",
      message: `Activate Lab ${lab.labName}?`,
      data: { labId: lab._id },
    });
  };

  return (
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
            setModal({view: "labDetails", data: lab});
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/25"
        >
          <Icons.Details />
          Lab Details
        </button>
        <div className="flex gap-3">
          {lab.isActive ? (
            <button
              onClick={handleDeactivate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-white shadow-lg hover:shadow-amber-500/25 text-sm"
            >
              <Icons.Deactivate />
              Deactivate
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-white shadow-lg hover:shadow-emerald-500/25 text-sm"
            >
              <Icons.Play />
              Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabDetails;
