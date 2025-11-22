import useLabManagementStore from "./store";

const BillingForm = () => {
  const {  updateBillingForm, updateLabBilling, clearBillingForm, modal, closeModal } =
    useLabManagementStore();
  let billingForm = {};
  const handleSubmit = (e) => {
    e.preventDefault();
    updateLabBilling();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // Convert to number for financial fields
    const numericValue = name !== "labName" ? parseFloat(value) || 0 : value;
    updateBillingForm(name, numericValue);
  };

  const closeForm = () => {
    // clearBillingForm();
    closeModal();
  };

  // Current values from modal data
  const currentValues = modal.data || {};
  const currentProfit = (currentValues.invoicePrice || 0) - (currentValues.labIncentive || 0);
  const newProfit =
    (billingForm.invoicePrice || currentValues.invoicePrice || 0) -
    (billingForm.labIncentive || currentValues.labIncentive || 0);

  return (
    <>
      {/* Billing Form */}
      <div className="space-y-1 p-2">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Billing Information</h2>
          {modal.data && <p className="text-sm text-gray-600 mt-1">for {modal.data.labName}</p>}
        </div>

        {/* Lab Name Field (Read-only) */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-32 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Lab Name
          </label>
          <input
            type="text"
            name="labName"
            value={modal.data?.labName || ""}
            readOnly
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none bg-gray-50 text-gray-600"
          />
        </div>

        {/* Invoice Price Field with Current Value */}
        <div className="space-y-2">
          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-32 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Invoice Price
            </label>
            <div className="flex-1 flex items-center">
              <span className="px-2 py-1 text-gray-500">৳</span>
              <input
                type="number"
                name="invoicePrice"
                value={billingForm.invoicePrice ?? currentValues.invoicePrice ?? ""}
                onChange={handleFieldChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-1 py-1 rounded-r-lg focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs px-2">
            <span className="text-gray-500">Current: ৳{currentValues.invoicePrice || 0}</span>
            <span
              className={`font-medium ${
                (billingForm.invoicePrice ?? currentValues.invoicePrice ?? 0) > (currentValues.invoicePrice || 0)
                  ? "text-green-600"
                  : (billingForm.invoicePrice ?? currentValues.invoicePrice ?? 0) < (currentValues.invoicePrice || 0)
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              New: ৳{billingForm.invoicePrice ?? currentValues.invoicePrice ?? 0}
            </span>
          </div>
        </div>

        {/* Lab Commission Field with Current Value */}
        <div className="space-y-2">
          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-32 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Lab Commission
            </label>
            <div className="flex-1 flex items-center">
              <span className="px-2 py-1 text-gray-500">৳</span>
              <input
                type="number"
                name="labIncentive"
                value={billingForm.labIncentive ?? currentValues.labIncentive ?? ""}
                onChange={handleFieldChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-1 py-1 rounded-r-lg focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs px-2">
            <span className="text-gray-500">Current: ৳{currentValues.labIncentive || 0}</span>
            <span
              className={`font-medium ${
                (billingForm.labIncentive ?? currentValues.labIncentive ?? 0) > (currentValues.labIncentive || 0)
                  ? "text-red-600"
                  : (billingForm.labIncentive ?? currentValues.labIncentive ?? 0) < (currentValues.labIncentive || 0)
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              New: ৳{billingForm.labIncentive ?? currentValues.labIncentive ?? 0}
            </span>
          </div>
        </div>

        {/* Monthly Fee Field with Current Value */}
        <div className="space-y-2">
          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-32 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Monthly Fee
            </label>
            <div className="flex-1 flex items-center">
              <span className="px-2 py-1 text-gray-500">৳</span>
              <input
                type="number"
                name="monthlyFee"
                value={billingForm.monthlyFee ?? currentValues.monthlyFee ?? ""}
                onChange={handleFieldChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-1 py-1 rounded-r-lg focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs px-2">
            <span className="text-gray-500">Current: ৳{currentValues.monthlyFee || 0}</span>
            <span
              className={`font-medium ${
                (billingForm.monthlyFee ?? currentValues.monthlyFee ?? 0) > (currentValues.monthlyFee || 0)
                  ? "text-red-600"
                  : (billingForm.monthlyFee ?? currentValues.monthlyFee ?? 0) < (currentValues.monthlyFee || 0)
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              New: ৳{billingForm.monthlyFee ?? currentValues.monthlyFee ?? 0}
            </span>
          </div>
        </div>

        {/* Profit Comparison */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">Profit Comparison</label>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Current Profit</span>
              <span className="font-semibold text-gray-900">৳{currentProfit}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">New Profit</span>
              <span
                className={`font-bold ${
                  newProfit > currentProfit
                    ? "text-green-600"
                    : newProfit < currentProfit
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                ৳{newProfit}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium text-gray-700">Difference</span>
              <span
                className={`font-bold ${
                  newProfit > currentProfit
                    ? "text-green-600"
                    : newProfit < currentProfit
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {newProfit > currentProfit ? "+" : ""}৳{newProfit - currentProfit}
              </span>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-3">Profit = Invoice Price - Lab Commission</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Update Billing
          </button>
          <button
            onClick={closeForm}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default BillingForm;
