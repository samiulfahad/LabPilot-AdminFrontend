import Icons from "../../components/icons";
import useLabManagementStore from "./store";

const LabDetails = ({ lab }) => {
  const { setPopup, setModal } = useLabManagementStore();

  const handleDeactivate = () => {
    setPopup({
      type: "confirmation",
      action: "deactivateLab",
      message: `Deactivate Lab ${lab.name}?`,
      data: { labId: lab._id },
    });
  };

  const handleActivate = () => {
    setPopup({
      type: "confirmation",
      action: "activateLab",
      message: `Activate Lab ${lab.name}?`,
      data: { labId: lab._id },
    });
  };

  const handleEditBilling = () => {
    setModal({
      view: "labBillingForm",
      data: lab,
    });
  };

  const handleBillingHistory = () => {
    setModal({
      view: "billingHistory",
      data: lab,
    });
  };

  // Calculate profit
  const profit = lab.invoicePrice - lab.commission;

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{lab.name}</h3>
              <p className="text-gray-600">ID: {lab.labId}</p>
            </div>
          </div>

          {/* Status and Stats - Moved closer to lab name */}
          <div className="flex items-center gap-4 ml-18">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-48">
          <button
            onClick={() => setModal({ view: "labDetails", data: lab })}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/25"
          >
            <Icons.Details className="w-4 h-4" />
            Lab Details
          </button>

          <div className="flex gap-3">
            {lab.isActive ? (
              <button
                onClick={handleDeactivate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-white shadow-lg hover:shadow-amber-500/25 text-sm"
              >
                <Icons.Deactivate className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-white shadow-lg hover:shadow-emerald-500/25 text-sm"
              >
                <Icons.Play className="w-4 h-4" />
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Billing Section */}
      <div className="space-y-4">
        {/* Billing Overview - Full Width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-row items-center justify-between mb-4 gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Billing Overview</h3>
            </div>
            <button
              onClick={handleEditBilling}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 text-sm whitespace-nowrap"
            >
              <Icons.Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Billing</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>

          {/* 4-column grid for better desktop layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-600 font-bold">৳</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Price</p>
                  <p className="text-sm text-gray-500">Per Invoice</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">৳{lab.invoicePrice || 0}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold">%</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Commission</p>
                  <p className="text-sm text-gray-500">Partner share</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">৳{lab.commission || 0}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 font-bold">💰</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Profit</p>
                  <p className="text-sm text-gray-500">Net earnings</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">৳{profit || 0}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 font-bold">M</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Fee</p>
                  <p className="text-sm text-gray-500">Per Month</p>
                </div>
              </div>
              <p className="text-xl font-bold text-purple-600">৳{lab.monthlyFee || 0}</p>
            </div>
          </div>
        </div>

        {/* Billing History - Full Width */}
        <button
          onClick={handleBillingHistory}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl hover:border-green-300 hover:from-green-50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
              <span className="text-green-600 text-lg">📊</span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 group-hover:text-green-700 text-lg">Billing History</h4>
              <p className="text-sm text-gray-500 group-hover:text-green-600">
                View all payment records and transactions
              </p>
            </div>
          </div>
          <div className="text-green-600 group-hover:text-green-700">
            <Icons.History className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default LabDetails;
